# YouTube API Integration Setup Guide

This guide will help you set up automatic YouTube content fetching for your Segishop website.

## Overview

The YouTube showcase section can automatically fetch your latest videos and shorts from your YouTube channel using the YouTube Data API v3. This eliminates the need to manually update video content on your website.

## Features

- ✅ Automatic fetching of latest videos and shorts
- ✅ Real-time thumbnail loading
- ✅ View counts, likes, and comments display
- ✅ Automatic refresh every 10 minutes
- ✅ Manual refresh button
- ✅ Fallback to demo data if API is unavailable
- ✅ Caching to reduce API quota usage

## Setup Instructions

### Step 1: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### Step 2: Find Your Channel ID

1. Go to your YouTube channel
2. Click on your profile picture > "Your channel"
3. Look at the URL - your channel ID is after `/channel/`
   - Example: `https://www.youtube.com/channel/UCYourChannelIdHere`
   - Or use [this tool](https://commentpicker.com/youtube-channel-id.php) to find it

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your_actual_channel_id_here
   ```

### Step 4: Update YouTube Service

Edit `src/services/youtubeApiService.ts` and update the channel ID:

```typescript
private readonly channelId: string = 'YOUR_ACTUAL_CHANNEL_ID';
```

### Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `/trending` page
3. You should see a green "Live Data" indicator if the API is working
4. Use the refresh button to manually update content

## API Quotas and Limits

- YouTube Data API v3 has a daily quota limit (10,000 units by default)
- Each request consumes different amounts of quota:
  - Channel details: ~3 units
  - Video list: ~100 units
  - Video details: ~1 unit per video

The integration is optimized to minimize quota usage:
- Caching responses for 5 minutes
- Automatic refresh only every 10 minutes
- Fallback to demo data if quota is exceeded

## Troubleshooting

### "Live Data" shows as "Demo Data"

1. Check if your API key is correctly set in `.env.local`
2. Verify the channel ID is correct
3. Ensure YouTube Data API v3 is enabled in Google Cloud Console
4. Check browser console for error messages

### API Quota Exceeded

1. The system will automatically fall back to demo data
2. Wait for the quota to reset (daily)
3. Consider requesting a quota increase from Google

### Videos Not Updating

1. Use the manual refresh button
2. Check if new videos are actually published on your channel
3. Clear browser cache and reload

## Security Notes

- Never commit your actual API keys to version control
- Use environment variables for all sensitive data
- The API key is exposed to the client-side (NEXT_PUBLIC_*), which is normal for YouTube Data API
- Consider implementing server-side API calls for production use

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Consider implementing server-side caching
3. Monitor API usage in Google Cloud Console
4. Set up alerts for quota usage

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key and channel ID
3. Test the API directly using Google's API Explorer
4. Contact support with specific error messages

---

**Note**: The system will work with demo data even without API setup, but you'll get the best experience with live data from your actual YouTube channel.
