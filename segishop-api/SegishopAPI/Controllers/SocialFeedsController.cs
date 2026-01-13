using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SegishopAPI.Data;
using System.Text.RegularExpressions;
using System.Text.Json;
using System.Linq;

namespace SegishopAPI.Controllers
{
    [ApiController]
    [Route("api/site/social")]
    public class SocialFeedsController : ControllerBase
    {
        private readonly SegishopDbContext _context;
        private readonly HttpClient _http;

        public SocialFeedsController(SegishopDbContext context)
        {
            _context = context;
            _http = new HttpClient();
        }

        [HttpGet("youtube")]
        public async Task<ActionResult> YouTube()
        {
            var s = await _context.SocialIntegrationSettings.FirstOrDefaultAsync();
            var apiKey = s?.YouTubeApiKey;
            var channelIdOrHandle = s?.YouTubeChannelId;
            if (s != null && s.UseManualYouTube && !string.IsNullOrWhiteSpace(s.YouTubeManualLinks))
            {
                var links = s.YouTubeManualLinks!.Split(new[] { '\n', '\r', ',', ';' }, StringSplitOptions.RemoveEmptyEntries).Select(x => x.Trim()).Where(x => x.Length > 0).ToList();
                List<object> shorts = new List<object>();
                List<object> videos = new List<object>();
                foreach (var link in links)
                {
                    string id = link;
                    var m1 = Regex.Match(link, @"v=([A-Za-z0-9_-]{6,})");
                    var m2 = Regex.Match(link, @"youtu\.be/([A-Za-z0-9_-]{6,})");
                    var m3 = Regex.Match(link, @"/shorts/([A-Za-z0-9_-]{6,})");
                    if (m1.Success) id = m1.Groups[1].Value; else if (m2.Success) id = m2.Groups[1].Value; else if (m3.Success) id = m3.Groups[1].Value;
                    var thumb = $"https://img.youtube.com/vi/{id}/hqdefault.jpg";
                    var item = new
                    {
                        id,
                        snippet = new { title = id, publishedAt = DateTime.UtcNow.ToString("o"), thumbnails = new { maxres = new { url = thumb }, high = new { url = thumb }, medium = new { url = thumb } } },
                        statistics = new { viewCount = "0", likeCount = "0", commentCount = "0" },
                        contentDetails = new { duration = m3.Success ? "PT0M59S" : "PT10M00S" }
                    };
                    if (m3.Success) shorts.Add(item); else videos.Add(item);
                }
                return new JsonResult(new { shorts, videos, channelStats = new { subscriberCount = "0", videoCount = (shorts.Count + videos.Count).ToString(), viewCount = "0" } });
            }
            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(channelIdOrHandle))
                return BadRequest(new { error = "YouTube not configured" });

            string channelId = channelIdOrHandle!;
            try
            {
                if (!channelId.StartsWith("UC"))
                {
                    var handle = channelId.TrimStart('@');
                    var searchUrl = $"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q={Uri.EscapeDataString(handle)}&key={Uri.EscapeDataString(apiKey!)}";
                    var searchRes = await _http.GetAsync(searchUrl);
                    var searchJson = await searchRes.Content.ReadAsStringAsync();
                    if (!searchRes.IsSuccessStatusCode) return StatusCode((int)searchRes.StatusCode, searchJson);
                    var doc = System.Text.Json.JsonDocument.Parse(searchJson);
                    if (doc.RootElement.TryGetProperty("items", out var itemsEl))
                    {
                        var enumerator = itemsEl.EnumerateArray();
                        if (enumerator.MoveNext())
                        {
                            var idEl = enumerator.Current.GetProperty("id").GetProperty("channelId");
                            var cid = idEl.GetString();
                            if (!string.IsNullOrWhiteSpace(cid)) channelId = cid!;
                        }
                        else
                        {
                            return NotFound(new { error = "Channel not found from handle/query" });
                        }
                    }
                    else
                    {
                        return NotFound(new { error = "Invalid search response" });
                    }
                }
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }

            var channelsUrl = $"https://www.googleapis.com/youtube/v3/channels?part=contentDetails,statistics&id={Uri.EscapeDataString(channelId)}&key={Uri.EscapeDataString(apiKey!)}";
            var chRes = await _http.GetAsync(channelsUrl);
            if (!chRes.IsSuccessStatusCode) return StatusCode((int)chRes.StatusCode, await chRes.Content.ReadAsStringAsync());
            var chJson = await chRes.Content.ReadAsStringAsync();
            var chDoc = System.Text.Json.JsonDocument.Parse(chJson);
            if (!chDoc.RootElement.TryGetProperty("items", out var items)) return NotFound(new { error = "Invalid channel response" });
            if (items.GetArrayLength() == 0) return NotFound(new { error = "Channel not found" });
            var firstItem = items.EnumerateArray().First();
            var uploads = firstItem.GetProperty("contentDetails").GetProperty("relatedPlaylists").GetProperty("uploads").GetString();
            var statsEl = firstItem.GetProperty("statistics");

            var aggregatedIds = new List<string>();
            string? pageToken = null;
            int iterations = 0;
            do
            {
                var playlistUrl = $"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={Uri.EscapeDataString(uploads!)}&maxResults=50{(string.IsNullOrWhiteSpace(pageToken) ? "" : "&pageToken=" + Uri.EscapeDataString(pageToken))}&key={Uri.EscapeDataString(apiKey!)}";
                var plRes = await _http.GetAsync(playlistUrl);
                var plJson = await plRes.Content.ReadAsStringAsync();
                var plDoc = JsonDocument.Parse(plJson);
                if (!plDoc.RootElement.TryGetProperty("items", out var plItems)) break;
                var ids = plItems.EnumerateArray()
                    .Select(i => i.GetProperty("snippet").GetProperty("resourceId").GetProperty("videoId").GetString())
                    .Where(id => !string.IsNullOrWhiteSpace(id))
                    .Cast<string>();
                aggregatedIds.AddRange(ids);
                pageToken = plDoc.RootElement.TryGetProperty("nextPageToken", out var next) ? next.GetString() : null;
                iterations++;
            } while (!string.IsNullOrWhiteSpace(pageToken) && aggregatedIds.Count < 120 && iterations < 3);

            if (aggregatedIds.Count == 0) return NotFound(new { error = "No video IDs found" });

            var videosItems = new List<object>();
            foreach (var chunk in aggregatedIds.Distinct().Take(150).Chunk(50))
            {
                var idsParam = string.Join(",", chunk);
                var videosUrl = $"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id={Uri.EscapeDataString(idsParam)}&key={Uri.EscapeDataString(apiKey!)}";
                var vRes = await _http.GetAsync(videosUrl);
                var vJson = await vRes.Content.ReadAsStringAsync();
                var vDoc = JsonDocument.Parse(vJson);
                if (!vDoc.RootElement.TryGetProperty("items", out var vItems)) continue;
                foreach (var it in vItems.EnumerateArray())
                {
                    var id = it.GetProperty("id").GetString() ?? "";
                    var snippet = it.GetProperty("snippet");
                    var statistics = it.TryGetProperty("statistics", out var statsEl2) ? statsEl2 : default;
                    var content = it.TryGetProperty("contentDetails", out var contentEl) ? contentEl : default;
                    videosItems.Add(new
                    {
                        id,
                        snippet = new
                        {
                            title = snippet.TryGetProperty("title", out var t) ? t.GetString() : "",
                            publishedAt = snippet.TryGetProperty("publishedAt", out var p) ? p.GetString() : "",
                            thumbnails = snippet.TryGetProperty("thumbnails", out var th) ? JsonSerializer.Deserialize<object>(th.GetRawText()) : null
                        },
                        statistics = statistics.ValueKind != JsonValueKind.Undefined ? JsonSerializer.Deserialize<object>(statistics.GetRawText()) : null,
                        contentDetails = content.ValueKind != JsonValueKind.Undefined ? JsonSerializer.Deserialize<object>(content.GetRawText()) : null
                    });
                }
            }

            // Augment with recent short videos via search API
            var searchShortsUrl = $"https://www.googleapis.com/youtube/v3/search?part=id&channelId={Uri.EscapeDataString(channelId)}&type=video&order=date&maxResults=50&videoDuration=short&key={Uri.EscapeDataString(apiKey!)}";
            var sRes = await _http.GetAsync(searchShortsUrl);
            var sJson = await sRes.Content.ReadAsStringAsync();
            if (sRes.IsSuccessStatusCode)
            {
                var sDoc = JsonDocument.Parse(sJson);
                if (sDoc.RootElement.TryGetProperty("items", out var sItems))
                {
                    var shortIds = sItems.EnumerateArray()
                        .Select(i => i.GetProperty("id").GetProperty("videoId").GetString())
                        .Where(id => !string.IsNullOrWhiteSpace(id))
                        .Cast<string>()
                        .Except(videosItems.Select(v => ((dynamic)v).id as string));

                    foreach (var chunk in shortIds.Take(50).Chunk(50))
                    {
                        var idsParam = string.Join(",", chunk);
                        var videosUrl = $"https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id={Uri.EscapeDataString(idsParam)}&key={Uri.EscapeDataString(apiKey!)}";
                        var vRes2 = await _http.GetAsync(videosUrl);
                        var vJson2 = await vRes2.Content.ReadAsStringAsync();
                        var vDoc2 = JsonDocument.Parse(vJson2);
                        if (!vDoc2.RootElement.TryGetProperty("items", out var vItems2)) continue;
                        foreach (var it in vItems2.EnumerateArray())
                        {
                            var id = it.GetProperty("id").GetString() ?? "";
                            var snippet = it.GetProperty("snippet");
                            var statistics = it.TryGetProperty("statistics", out var statsEl2) ? statsEl2 : default;
                            var content = it.TryGetProperty("contentDetails", out var contentEl) ? contentEl : default;
                            videosItems.Add(new
                            {
                                id,
                                snippet = new
                                {
                                    title = snippet.TryGetProperty("title", out var t) ? t.GetString() : "",
                                    publishedAt = snippet.TryGetProperty("publishedAt", out var p) ? p.GetString() : "",
                                    thumbnails = snippet.TryGetProperty("thumbnails", out var th) ? JsonSerializer.Deserialize<object>(th.GetRawText()) : null
                                },
                                statistics = statistics.ValueKind != JsonValueKind.Undefined ? JsonSerializer.Deserialize<object>(statistics.GetRawText()) : null,
                                contentDetails = content.ValueKind != JsonValueKind.Undefined ? JsonSerializer.Deserialize<object>(content.GetRawText()) : null
                            });
                        }
                    }
                }
            }

            bool IsShortFromIso(string? iso)
            {
                if (string.IsNullOrWhiteSpace(iso)) return false;
                var m = Regex.Match(iso!, "PT(?:(\\d+)M)?(?:(\\d+)S)?", RegexOptions.IgnoreCase);
                if (!m.Success) return false;
                var minutes = int.TryParse(m.Groups[1].Value, out var mi) ? mi : 0;
                var seconds = int.TryParse(m.Groups[2].Value, out var se) ? se : 0;
                return minutes * 60 + seconds <= 60;
            }

            bool TitleSuggestsShort(string? title)
            {
                if (string.IsNullOrWhiteSpace(title)) return false;
                return Regex.IsMatch(title!, "(^|[^a-z])shorts([^a-z]|$)|#shorts", RegexOptions.IgnoreCase);
            }

            var shortList = new List<object>();
            var longList = new List<object>();
            foreach (dynamic v in videosItems)
            {
                string? title = null;
                string? iso = null;
                try
                {
                    var sn = (JsonElement)v.snippet;
                    if (sn.ValueKind != JsonValueKind.Undefined && sn.TryGetProperty("title", out var t)) title = t.GetString();
                    var cd = (JsonElement)v.contentDetails;
                    if (cd.ValueKind != JsonValueKind.Undefined && cd.TryGetProperty("duration", out var d)) iso = d.GetString();
                }
                catch { }
                var isShort = IsShortFromIso(iso) || TitleSuggestsShort(title);
                if (isShort) shortList.Add(v); else longList.Add(v);
            }

            var response = new
            {
                shorts = shortList,
                videos = longList,
                channelStats = new
                {
                    subscriberCount = statsEl.GetProperty("subscriberCount").GetString(),
                    videoCount = statsEl.GetProperty("videoCount").GetString(),
                    viewCount = statsEl.GetProperty("viewCount").GetString()
                }
            };
            return new JsonResult(response);
        }
        [HttpGet("instagram-graph")]
        public async Task<ActionResult> InstagramGraph()
        {
            var s = await _context.SocialIntegrationSettings.FirstOrDefaultAsync();
            if (s != null && s.UseManualInstagram && !string.IsNullOrWhiteSpace(s.InstagramManualLinks))
            {
                var links = s.InstagramManualLinks!.Split(new[] { '\n', '\r', ',', ';' }, StringSplitOptions.RemoveEmptyEntries).Select(x => x.Trim()).Where(x => x.Length > 0).ToList();
                var list = new List<object>();
                foreach (var link in links)
                {
                    try
                    {
                        var req = new HttpRequestMessage(HttpMethod.Get, link);
                        req.Headers.Add("User-Agent", "Mozilla/5.0");
                        var res1 = await _http.SendAsync(req);
                        var html = await res1.Content.ReadAsStringAsync();
                        string? img = null; string? title = null;
                        var mImg = Regex.Match(html, "<meta property=\"og:image\" content=\"([^\"]+)\"", RegexOptions.IgnoreCase);
                        var mTitle = Regex.Match(html, "<meta property=\"og:title\" content=\"([^\"]+)\"", RegexOptions.IgnoreCase);
                        if (mImg.Success) img = mImg.Groups[1].Value;
                        if (mTitle.Success) title = mTitle.Groups[1].Value;
                        list.Add(new { id = Guid.NewGuid().ToString("N"), caption = title ?? "", media_type = "VIDEO", media_url = img ?? "", permalink = link, thumbnail_url = img ?? "", timestamp = DateTime.UtcNow.ToString("o") });
                    }
                    catch { }
                }
                return new JsonResult(new { data = list });
            }
            if (s == null || string.IsNullOrWhiteSpace(s.InstagramUserId) || string.IsNullOrWhiteSpace(s.InstagramAccessToken))
                return BadRequest(new { error = "Instagram not configured" });
            var url = $"https://graph.instagram.com/{Uri.EscapeDataString(s.InstagramUserId)}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token={Uri.EscapeDataString(s.InstagramAccessToken)}";
            var res = await _http.GetAsync(url);
            var body = await res.Content.ReadAsStringAsync();
            return Content(body, "application/json");
        }

        [HttpGet("tiktok-user")]
        public async Task<ActionResult> TikTokUser()
        {
            var s = await _context.SocialIntegrationSettings.FirstOrDefaultAsync();
            if (s != null && s.UseManualTikTok && !string.IsNullOrWhiteSpace(s.TikTokManualLinks))
            {
                var links = s.TikTokManualLinks!.Split(new[] { '\n', '\r', ',', ';' }, StringSplitOptions.RemoveEmptyEntries).Select(x => x.Trim()).Where(x => x.Length > 0).ToList();
                var postsManual = new List<object>();
                foreach (var link in links)
                {
                    try
                    {
                        var req0 = new HttpRequestMessage(HttpMethod.Get, link);
                        req0.Headers.Add("User-Agent", "Mozilla/5.0");
                        var res0 = await _http.SendAsync(req0);
                        var html0 = await res0.Content.ReadAsStringAsync();
                        string? img0 = null; string? title0 = null;
                        var mImg0 = Regex.Match(html0, "<meta property=\"og:image\" content=\"([^\"]+)\"", RegexOptions.IgnoreCase);
                        var mTitle0 = Regex.Match(html0, "<meta property=\"og:title\" content=\"([^\"]+)\"", RegexOptions.IgnoreCase);
                        if (mImg0.Success) img0 = mImg0.Groups[1].Value;
                        if (mTitle0.Success) title0 = mTitle0.Groups[1].Value;
                        var idMatch = Regex.Match(link, @"/video/(\d+)");
                        var idVal = idMatch.Success ? idMatch.Groups[1].Value : Guid.NewGuid().ToString("N");
                        postsManual.Add(new { id = idVal, permalink = link, cover_image_url = img0 ?? "", title = title0 ?? "", like_count = 0, comment_count = 0, share_count = 0, view_count = 0, video_url = "", create_time = DateTime.UtcNow.ToString("o"), username = s.TikTokUsername ?? "" });
                    }
                    catch { }
                }
                return new JsonResult(new { posts = postsManual });
            }
            var username = string.IsNullOrWhiteSpace(s?.TikTokUsername) ? "thesegishop" : s!.TikTokUsername!;
            var url = $"https://www.tiktok.com/@{Uri.EscapeDataString(username)}";
            var req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36");
            req.Headers.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp");
            req.Headers.Add("Accept-Language", "en-US,en;q=0.9");
            req.Headers.Add("Referer", "https://www.google.com/");
            var webId = Guid.NewGuid().ToString("N").Substring(0, 16);
            var envCookies = Environment.GetEnvironmentVariable("TIKTOK_COOKIES");
            var cookieHeader = string.IsNullOrWhiteSpace(envCookies) ? $"tt_webid_v2={webId}; tt_webid={webId}" : envCookies;
            req.Headers.Add("Cookie", cookieHeader);
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode);
            var html = await res.Content.ReadAsStringAsync();
            var match = Regex.Match(html, "<script id=\"SIGI_STATE\" type=\"application/json\">([\\s\\S]*?)</script>");
            if (!match.Success)
            {
                var match2 = Regex.Match(html, "<script type=\"application/json\" id=\"__UNIVERSAL_DATA_FOR_REACT__\">([\\s\\S]*?)</script>");
                if (!match2.Success)
                {
                    var ldMatches = Regex.Matches(html, "<script type=\\\"application/ld\\+json\\\">([\\s\\S]*?)</script>");
                    var postsFromLd = new List<object>();
                    foreach (Match m in ldMatches)
                    {
                        try
                        {
                            var jsonLd = m.Groups[1].Value;
                            var doc = JsonDocument.Parse(jsonLd);
                            if (doc.RootElement.TryGetProperty("@type", out var typeEl))
                            {
                                var typeStr = typeEl.GetString();
                                if (string.Equals(typeStr, "ItemList", StringComparison.OrdinalIgnoreCase))
                                {
                                    if (doc.RootElement.TryGetProperty("itemListElement", out var listEl) && listEl.ValueKind == JsonValueKind.Array)
                                    {
                                        foreach (var it in listEl.EnumerateArray())
                                        {
                                            var v = it;
                                            if (v.ValueKind == JsonValueKind.Object)
                                            {
                                                var urlEl = v.TryGetProperty("url", out var uEl) ? uEl : default;
                                                var urlStr = urlEl.ValueKind != JsonValueKind.Undefined ? urlEl.GetString() : null;
                                                var nameEl = v.TryGetProperty("name", out var nEl) ? nEl : default;
                                                var nameStr = nameEl.ValueKind != JsonValueKind.Undefined ? nEl.GetString() : null;
                                                var thumbEl = v.TryGetProperty("thumbnailUrl", out var thEl) ? thEl : default;
                                                var thumbStr = thumbEl.ValueKind != JsonValueKind.Undefined ? thEl.GetString() : null;
                                                if (!string.IsNullOrWhiteSpace(urlStr))
                                                {
                                                    var idMatch = Regex.Match(urlStr!, @"/video/(\d+)");
                                                    var id = idMatch.Success ? idMatch.Groups[1].Value : urlStr;
                                                    postsFromLd.Add(new
                                                    {
                                                        id,
                                                        permalink = urlStr,
                                                        cover_image_url = thumbStr,
                                                        title = nameStr,
                                                        like_count = 0,
                                                        comment_count = 0,
                                                        share_count = 0,
                                                        view_count = 0,
                                                        video_url = "",
                                                        create_time = DateTime.UtcNow.ToString("o"),
                                                        username
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    return new JsonResult(new { posts = postsFromLd });
                }
                var json2 = match2.Groups[1].Value;
                try
                {
                    var doc2 = JsonDocument.Parse(json2);
                    if (doc2.RootElement.TryGetProperty("__DEFAULT_SCOPE__", out var scope) && scope.TryGetProperty("ItemModule", out var itemModule2))
                    {
                        var posts2 = new List<object>();
                        foreach (var prop in itemModule2.EnumerateObject())
                        {
                            var item = prop.Value;
                            var id = item.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
                            var desc = item.TryGetProperty("desc", out var dEl) ? dEl.GetString() : null;
                            var video = item.TryGetProperty("video", out var vEl) ? vEl : default;
                            var cover = video.ValueKind != JsonValueKind.Undefined && video.TryGetProperty("cover", out var cEl) ? cEl.GetString() : null;
                            var originCover = video.ValueKind != JsonValueKind.Undefined && video.TryGetProperty("originCover", out var ocEl) ? ocEl.GetString() : null;
                            var playAddr = video.ValueKind != JsonValueKind.Undefined && video.TryGetProperty("playAddr", out var pEl) ? pEl.GetString() : null;
                            var stats = item.TryGetProperty("stats", out var stEl) ? stEl : default;
                            var digg = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("diggCount", out var dgEl) ? dgEl.GetInt32() : 0;
                            var comments = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("commentCount", out var cmEl) ? cmEl.GetInt32() : 0;
                            var shares = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("shareCount", out var shEl) ? shEl.GetInt32() : 0;
                            var views = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("playCount", out var plEl) ? plEl.GetInt32() : 0;
                            var createTime = item.TryGetProperty("createTime", out var ctEl) ? ctEl.GetInt64() : 0;
                            posts2.Add(new
                            {
                                id,
                                permalink = id != null ? $"https://www.tiktok.com/@{username}/video/{id}" : null,
                                cover_image_url = cover ?? originCover,
                                title = desc,
                                like_count = digg,
                                comment_count = comments,
                                share_count = shares,
                                view_count = views,
                                video_url = playAddr,
                                create_time = createTime > 0 ? DateTimeOffset.FromUnixTimeSeconds(createTime).UtcDateTime.ToString("o") : null,
                                username
                            });
                        }
                        return new JsonResult(new { posts = posts2 });
                    }
                }
                catch { }
                return Ok(new { posts = Array.Empty<object>() });
            }
            var json = match.Groups[1].Value;
            var state = JsonDocument.Parse(json);
            var posts = new List<object>();
            try
            {
                if (state.RootElement.TryGetProperty("ItemModule", out var itemModule))
                {
                    foreach (var prop in itemModule.EnumerateObject())
                    {
                        var item = prop.Value;
                        var id = item.TryGetProperty("id", out var idEl) ? idEl.GetString() : null;
                        var desc = item.TryGetProperty("desc", out var dEl) ? dEl.GetString() : null;
                        var video = item.TryGetProperty("video", out var vEl) ? vEl : default;
                        var cover = video.ValueKind != JsonValueKind.Undefined && video.TryGetProperty("cover", out var cEl) ? cEl.GetString() : null;
                        var originCover = video.ValueKind != JsonValueKind.Undefined && video.TryGetProperty("originCover", out var ocEl) ? ocEl.GetString() : null;
                        var playAddr = video.ValueKind != JsonValueKind.Undefined && video.TryGetProperty("playAddr", out var pEl) ? pEl.GetString() : null;
                        var stats = item.TryGetProperty("stats", out var stEl) ? stEl : default;
                        var digg = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("diggCount", out var dgEl) ? dgEl.GetInt32() : 0;
                        var comments = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("commentCount", out var cmEl) ? cmEl.GetInt32() : 0;
                        var shares = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("shareCount", out var shEl) ? shEl.GetInt32() : 0;
                        var views = stats.ValueKind != JsonValueKind.Undefined && stats.TryGetProperty("playCount", out var plEl) ? plEl.GetInt32() : 0;
                        var createTime = item.TryGetProperty("createTime", out var ctEl) ? ctEl.GetInt64() : 0;
                        posts.Add(new
                        {
                            id,
                            permalink = id != null ? $"https://www.tiktok.com/@{username}/video/{id}" : null,
                            cover_image_url = cover ?? originCover,
                            title = desc,
                            like_count = digg,
                            comment_count = comments,
                            share_count = shares,
                            view_count = views,
                            video_url = playAddr,
                            create_time = createTime > 0 ? DateTimeOffset.FromUnixTimeSeconds(createTime).UtcDateTime.ToString("o") : null,
                            username
                        });
                    }
                }
            }
            catch { }
            return new JsonResult(new { posts });
        }

        [HttpGet("image")]
        public async Task<IActionResult> Image([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url) || !(url.StartsWith("http://") || url.StartsWith("https://")))
                return BadRequest("invalid url");
            var req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36");
            req.Headers.Add("Accept", "image/avif,image/webp,image/*,*/*;q=0.8");
            req.Headers.Add("Accept-Language", "en-US,en;q=0.9");
            req.Headers.Add("Referer", "https://www.instagram.com/");
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode)
                return StatusCode((int)res.StatusCode);
            var contentType = res.Content.Headers.ContentType?.ToString() ?? "image/jpeg";
            var bytes = await res.Content.ReadAsByteArrayAsync();
            return File(bytes, contentType);
        }
    }
}
