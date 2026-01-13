// Etsy Reviews Service
// This service provides mock review data matching the provided images

export interface EtsyReview {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
  shop: 'snacks' | 'handmades';
}

export interface EtsyShop {
  id: string;
  name: string;
  description: string;
  url: string;
  totalReviews: number;
  averageRating: number;
}

// Shop configurations
export const ETSY_SHOPS = {
  snacks: {
    id: 'PrintOscarSnacks',
    name: 'PrintOscar Snacks',
    description: 'Delicious Indigenous Snacks',
    url: 'https://www.etsy.com/shop/PrintOscarSnacks',
    totalReviews: 150,
    averageRating: 5.0
  },
  handmades: {
    id: 'printoscar_handmades',
    name: 'PrintOscar Handmades',
    description: 'Where Culture Meets Craft',
    url: 'https://www.etsy.com/shop/printoscar_handmades/',
    totalReviews: 124,
    averageRating: 5.0
  }
} as const;

class EtsyService {
  /**
   * Get reviews for a specific Etsy shop
   * Returns mock data based on the provided images
   */
  async getShopReviews(shopType: 'snacks' | 'handmades', limit = 20): Promise<EtsyReview[]> {
    return this.getMockReviews(shopType, limit);
  }

  /**
   * Mock reviews data from the provided images
   */
  private getMockReviews(shopType: 'snacks' | 'handmades', limit: number): EtsyReview[] {
    const allMockReviews: EtsyReview[] = [
      // Snacks reviews from the provided image
      {
        id: '1',
        customerName: 'KStachowiak',
        rating: 5,
        review: 'Very Wonderful! Where It is a secret Santa gift & it was a huge hit !',
        date: 'December 23, 2024',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '2',
        customerName: 'Adebola',
        rating: 5,
        review: 'Very tasty and great for everyone and great customer service too',
        date: 'April 26, 2024',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '3',
        customerName: 'Adebola',
        rating: 5,
        review: 'Really good! And very fast shipping too. Thank you',
        date: 'March 29, 2024',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '4',
        customerName: 'Donnie',
        rating: 5,
        review: 'I give it Thumbs up',
        date: 'February 27, 2024',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '5',
        customerName: 'Gina',
        rating: 5,
        review: 'Arrived quickly! Thank you. We enjoyed.',
        date: 'February 19, 2024',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '6',
        customerName: 'aubreyhornak',
        rating: 5,
        review: 'My Nigerian friend LOVED this gift for her birthday. She had eaten and heard of many of the items but was introduced to a couple new ones. Very tasty.',
        date: 'February 3, 2024',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '7',
        customerName: 'Kristina',
        rating: 5,
        review: 'Seller did a great job of answer questions and products were amazing thank you again for the TLC, my exchange student was super excited at Christmas!',
        date: 'December 27, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '8',
        customerName: 'Sally',
        rating: 5,
        review: 'Got it for a secret Santa gift and the person was blown away and so excited about the snacks, he could not wait to show his brothers!',
        date: 'December 19, 2023',
        verified: true,
        shop: 'snacks'
      },
      // Additional snacks reviews from the new images
      {
        id: '13',
        customerName: 'Selina',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'June 27, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '14',
        customerName: 'Etta',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'June 18, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '15',
        customerName: 'Yannie',
        rating: 5,
        review: 'The item was perfect and the packaging was cute, I was confused on the qualities but I got that cleared up with the seller (great customer service btw). AND it tasted just like the one’s my dad brought back from Nigeria, if not better! ',
        date: 'June 6, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '16',
        customerName: 'Marci',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'May 25, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '17',
        customerName: 'Manuela',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'May 19, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '18',
        customerName: 'Ganiat Abayomi',
        rating: 5,
        review: 'The snacks are so tasty. Super fast delivery. Michelle should be awarded seller of the year.',
        date: 'February 12, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '19',
        customerName: 'Etta',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'January 27, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '20',
        customerName: 'Etta',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'January 20, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '21',
        customerName: 'Erin',
        rating: 5,
        review: 'I really enjoyed these and my husband did especially!',
        date: 'January 17, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '22',
        customerName: 'marchonda',
        rating: 5,
        review: 'Great quality and shipping was on time!',
        date: 'January 11, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '23',
        customerName: 'Shereva',
        rating: 5,
        review: 'Quick informative good product',
        date: 'January 5, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '24',
        customerName: 'PoldaPopDesigns',
        rating: 5,
        review: 'My friend loved the treats!',
        date: 'November 13, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '25',
        customerName: 'Nick',
        rating: 5,
        review: 'Ok not much and little.',
        date: 'September 23, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '26',
        customerName: 'Chinelo',
        rating: 5,
        review: 'Really delicious sweets. I particularly like the coconut crunch',
        date: 'September 16, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '27',
        customerName: 'chinelo2002',
        rating: 5,
        review: 'Really delicious sweets. I particularly like the coconut crunch',
        date: 'September 16, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '28',
        customerName: 'Chinelo',
        rating: 5,
        review: 'I really enjoyed the selections she sent. I particularly like the coconut tiger with butter and...',
        date: 'September 15, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '29',
        customerName: 'chinelo2002',
        rating: 5,
        review: 'I really enjoyed the selections she sent. I particularly like the coconut tiger with butter and...',
        date: 'September 15, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '30',
        customerName: 'Oluwakemi',
        rating: 5,
        review: 'Crunchy and well packaged, took me back to old days',
        date: 'September 4, 2023',
        verified: true,
        shop: 'snacks'
      },
      {
        id: '31',
        customerName: 'janicedoc',
        rating: 5,
        review: 'Left a 5-star rating. Excellent!',
        date: 'August 31, 2023',
        verified: true,
        shop: 'snacks'
      },
      // Handmades reviews from the provided image
      {
        id: '9',
        customerName: 'Anitra',
        rating: 5,
        review: 'Another beautiful bag from this shop! Already getting LOTS of compliments 😊',
        date: 'March 28',
        verified: true,
        shop: 'handmades'
      },
      {
        id: '10',
        customerName: 'Valentin',
        rating: 5,
        review: 'Very big and good bag love it a lot thank you very much',
        date: 'December 11, 2023',
        verified: true,
        shop: 'handmades'
      },
      {
        id: '11',
        customerName: 'CC',
        rating: 5,
        review: 'Very sturdy and durable. Bright colors that do not fade. Fast shipment with proper presentation. I have purchased 2 other bags and routinely am complimented on them. I LOVE them!',
        date: 'February 12, 2023',
        verified: true,
        shop: 'handmades'
      },
      // Additional handmades review from image
      {
        id: '12',
        customerName: 'AI-Generated Summary',
        rating: 5,
        review: 'Bags are praised for their beautiful designs and vibrant colors. Customers appreciate the durability and sturdiness of the bags. Fast shipping and excellent presentation enhance the buying experience.',
        date: 'Based on Etsy reviews',
        verified: false,
        shop: 'handmades'
      }
    ];

    return allMockReviews
      .filter(review => review.shop === shopType)
      .slice(0, limit);
  }

  /**
   * Get special testimonial reviews for the slider
   */
  getTestimonialReviews(): EtsyReview[] {
    return [
      {
        id: 'testimonial-1',
        customerName: 'Dr. Lola Olofin',
        rating: 5,
        review: 'I want to thank you for my beautiful Mother\'s Day package! My daughter got authentic Nigerian snacks. Keep up the good work. I highly recommend your service.',
        date: 'May 16, 2021',
        verified: true,
        shop: 'snacks'
      },
      {
        id: 'testimonial-2',
        customerName: 'Elena Neely',
        rating: 5,
        review: 'Beautiful purses and ownership experience.',
        date: 'Jun 9, 2022',
        verified: true,
        shop: 'handmades'
      },
      {
        id: 'testimonial-3',
        customerName: 'Segi Shop Chat',
        rating: 5,
        review: 'Beautiful Mother\'s Day package! My daughter got authentic Nigerian snacks. Keep up the good work. I highly recommend your service.',
        date: 'May 16, 2021',
        verified: true,
        shop: 'snacks'
      }
    ];
  }

}

// Export singleton instance
export const etsyService = new EtsyService();
