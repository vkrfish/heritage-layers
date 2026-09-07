export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "story-of-putharekulu",
    title: "The Story of Putharekulu: Nine Layers of Andhra Heritage",
    excerpt: "Discover the fascinating history behind Putharekulu, the delicate paper-thin sweet that has been a symbol of Andhra tradition for over a century.",
    content: `
      <h2>Origins in Atreyapuram</h2>
      <p>The story of Putharekulu begins in the small village of Atreyapuram, nestled on the banks of the Godavari River in Andhra Pradesh. This village has been the heart of Putharekulu making for over a century, with families passing down the art from generation to generation.</p>
      
      <h2>The Meaning Behind the Name</h2>
      <p>The name "Putharekulu" comes from the Telugu words "putha" (layer) and "rekulu" (sheets). This perfectly describes the sweet's most distinctive feature - its incredibly thin, paper-like layers that are folded nine times to create the final product.</p>
      
      <h2>A Temple Offering Turned Delicacy</h2>
      <p>Originally, Putharekulu was prepared as an offering to temples during festivals and special occasions. The intricate process and premium ingredients made it a symbol of devotion and celebration. Over time, it evolved from a temple offering to a beloved sweet enjoyed during weddings, festivals, and special family gatherings.</p>
      
      <h2>The Secret of the Perfect Sheet</h2>
      <p>What makes authentic Putharekulu truly special is the rice sheet. The batter is made from locally sourced rice that has been soaked overnight, then stone-ground to the perfect consistency. The art lies in sweeping this batter across an inverted clay pot and lifting the translucent sheet at exactly the right moment - a skill that takes years to master.</p>
      
      <h2>Preserving Tradition in Modern Times</h2>
      <p>In an era of mass-produced sweets, the makers of authentic Putharekulu have stayed true to their traditional methods. Each sheet is still lifted by hand, each fold made with care, and each batch prepared fresh to order. This commitment to tradition is what makes Putharekulu not just a sweet, but a piece of living heritage.</p>
    `,
    author: "9 Stories & Co.",
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-15",
    category: "Heritage",
    tags: ["Putharekulu", "Andhra Heritage", "Traditional Sweets", "Indian Culture"],
    featuredImage: "/blog/story-of-putharekulu.jpg",
    readingTime: 5,
    seoTitle: "The Story of Putharekulu: Origins and History of Andhra's Paper-Thin Sweet",
    seoDescription: "Learn about the fascinating history and origins of Putharekulu, the traditional Andhra sweet from Atreyapuram. Discover the meaning behind its name and how it became a symbol of Andhra heritage.",
    keywords: ["Putharekulu history", "Andhra sweets origin", "traditional Indian sweets", "Atreyapuram", "Indian food heritage"],
  },
  {
    slug: "how-putharekulu-is-made",
    title: "How Putharekulu Is Made: The Four Sacred Steps",
    excerpt: "Step into a traditional Andhra kitchen and witness the meticulous process of creating Putharekulu - from rice batter to the final delicate fold.",
    content: `
      <h2>Step 1: The Rice Batter</h2>
      <p>The process begins the night before. Local rice varieties are soaked overnight to achieve the perfect texture. The next morning, the rice is stone-ground to create a batter that's loose enough to sweep smoothly yet thick enough to hold its form when lifted.</p>
      
      <h2>Step 2: The Paper-Thin Sheet</h2>
      <p>This is where the magic happens. An inverted clay pot is heated over a steady flame. Using a cloth, the batter is swept across the pot's surface in a perfect circle. Within seconds, the batter sets into a translucent film thinner than paper. The timing must be precise - too early and it tears, too late and it becomes brittle.</p>
      
      <h2>Step 3: The Ghee and Filling</h2>
      <p>While the sheet is still warm, pure cow ghee is brushed across its surface. The ghee used here is special - clarified slowly until it develops a rich, caramel-like aroma. Then comes the filling: fine powdered sugar or dark palm jaggery, scattered evenly across the sheet.</p>
      
      <h2>Step 4: The Nine Folds</h2>
      <p>The final step requires the most skill. The sheet is folded nine times, creating nine delicate layers. Each fold must be gentle yet firm, ensuring the layers are even and the filling is distributed perfectly. The result is a sweet that literally melts in your mouth.</p>
      
      <h2>The Art of Mastery</h2>
      <p>While the process might seem simple, mastering it takes years. The temperature of the pot, the consistency of the batter, the timing of each lift - every detail matters. This is why authentic Putharekulu is still made by hand, preserving a craft that machines simply cannot replicate.</p>
    `,
    author: "9 Stories & Co.",
    publishedAt: "2024-01-20",
    updatedAt: "2024-01-20",
    category: "Craft",
    tags: ["Putharekulu Making", "Traditional Craft", "Andhra Cuisine", "Food Art"],
    featuredImage: "/blog/how-putharekulu-is-made.jpg",
    readingTime: 6,
    seoTitle: "How Putharekulu Is Made: Traditional Process and Techniques",
    seoDescription: "Discover the traditional four-step process of making Putharekulu. Learn about the rice batter, paper-thin sheets, ghee application, and the art of folding nine delicate layers.",
    keywords: ["Putharekulu recipe", "how to make Putharekulu", "traditional sweet making", "Andhra cooking techniques", "Indian food craft"],
  },
  {
    slug: "storing-putharekulu",
    title: "How to Store Putharekulu: Tips for Maximum Freshness",
    excerpt: "Learn the best practices for storing your Putharekulu to maintain its delicate texture and authentic taste for as long as possible.",
    content: `
      <h2>Understanding Putharekulu's Shelf Life</h2>
      <p>Authentic Putharekulu has a limited shelf life because it contains no preservatives - just pure ingredients. Depending on the variety, it typically lasts 12-15 days from the day it's made. The key is proper storage to maximize this timeframe.</p>
      
      <h2>The Golden Rules of Storage</h2>
      <h3>1. Airtight Container is Essential</h3>
      <p>Putharekulu is highly sensitive to moisture. Store it in an absolutely airtight container to prevent humidity from affecting the delicate layers. Glass or high-quality plastic containers with tight seals work best.</p>
      
      <h3>2. Cool, Dry Location</h3>
      <p>Choose a storage spot that's consistently cool and dry. Avoid areas near the stove, in direct sunlight, or where temperature fluctuates frequently. A pantry shelf away from heat sources is ideal.</p>
      
      <h3>3. No Refrigeration Required</h3>
      <p>Contrary to what you might expect, Putharekulu should not be refrigerated. The cold can make the ghee hard and affect the delicate texture. Room temperature storage is actually better for maintaining the authentic taste and mouthfeel.</p>
      
      <h2>Special Considerations by Variety</h2>
      <h3>Ghee Putharekulu</h3>
      <p>Due to the higher ghee content, this variety needs extra protection from heat. Store in the coolest part of your home and ensure the container is completely airtight.</p>
      
      <h3>Jaggery Putharekulu</h3>
      <p>The palm jaggery makes this variety slightly more hygroscopic (moisture-absorbing). Be extra vigilant about airtight storage and check regularly for any signs of moisture.</p>
      
      <h2>Signs Your Putharekulu Has Gone Bad</h2>
      <p>Fresh Putharekulu should have a pleasant ghee aroma and a dry, slightly crisp texture. If you notice any off smells, mold growth, or if the layers have become soggy or sticky, it's best to discard it.</p>
      
      <h2>Freezing for Extended Storage</h2>
      <p>If you need to store Putharekulu beyond its typical shelf life, freezing is possible. Wrap individual pieces tightly in parchment paper, then place in an airtight container. When ready to eat, let them come to room temperature naturally without opening the container to prevent condensation.</p>
    `,
    author: "9 Stories & Co.",
    publishedAt: "2024-01-25",
    updatedAt: "2024-01-25",
    category: "Tips",
    tags: ["Storage Tips", "Food Preservation", "Putharekulu Care", "Kitchen Tips"],
    featuredImage: "/blog/storing-putharekulu.jpg",
    readingTime: 4,
    seoTitle: "How to Store Putharekulu: Complete Guide for Maximum Freshness",
    seoDescription: "Learn the best methods for storing Putharekulu to maintain freshness and texture. Discover proper storage techniques, shelf life information, and tips for different varieties.",
    keywords: ["Putharekulu storage", "how to store Indian sweets", "sweet preservation", "food storage tips", "Putharekulu shelf life"],
  },
  {
    slug: "putharekulu-for-diwali",
    title: "Putharekulu for Diwali: The Perfect Festival Sweet",
    excerpt: "Discover why Putharekulu has become one of the most sought-after sweets for Diwali celebrations and how to incorporate it into your festive traditions.",
    content: `
      <h2>Why Putharekulu Perfectly Represents Diwali</h2>
      <p>Diwali, the festival of lights, celebrates the victory of light over darkness and good over evil. Putharekulu, with its golden hue from pure ghee and its delicate layers representing the layers of tradition, embodies the spirit of this festival perfectly.</p>
      
      <h2>A Tradition of Gifting</h2>
      <p>In Andhra households, Diwali gifting has traditionally included homemade sweets. Putharekulu's premium presentation and authentic taste make it an ideal choice for Diwali gifts. The teal and gold gift boxes add an extra touch of elegance to your festive offerings.</p>
      
      <h2>Diwali Menu Planning with Putharekulu</h2>
      <h3>As Part of the Sweet Spread</h3>
      <p>Putharekulu works beautifully alongside other Diwali sweets. Its delicate texture provides a nice contrast to richer sweets like Gulab Jamun or Jalebi. Serve it as part of a varied sweet platter for guests.</p>
      
      <h3>For Diwali Parties</h3>
      <p>The individual pieces make perfect finger foods for Diwali gatherings. Arrange them on decorative platters alongside other festive treats. Their elegant appearance adds sophistication to any Diwali spread.</p>
      
      <h2>Ordering Timeline for Diwali</h2>
      <p>Since authentic Putharekulu is made fresh to order, it's important to plan ahead. For Diwali orders, we recommend placing your order at least 2-3 weeks in advance to ensure availability and timely delivery. The rush during festival season can be significant.</p>
      
      <h2>Custom Diwali Gift Boxes</h2>
      <p>For corporate Diwali gifting or large family gatherings, we offer custom gift box options. These can include personalized messages, custom branding for corporate gifts, and bulk ordering discounts for large quantities.</p>
      
      <h2>Storing for Diwali</h2>
      <p>If you're ordering in advance for Diwali, proper storage becomes crucial. Follow our storage guidelines carefully, and consider ordering closer to the festival if you're concerned about freshness. Our insulated packaging ensures that Putharekulu reaches you in perfect condition.</p>
    `,
    author: "9 Stories & Co.",
    publishedAt: "2024-02-01",
    updatedAt: "2024-02-01",
    category: "Festivals",
    tags: ["Diwali", "Festival Sweets", "Indian Festivals", "Diwali Gifting"],
    featuredImage: "/blog/putharekulu-for-diwali.jpg",
    readingTime: 5,
    seoTitle: "Putharekulu for Diwali: Perfect Festival Sweet and Gifting Guide",
    seoDescription: "Learn why Putharekulu is the ideal sweet for Diwali celebrations. Discover gifting ideas, menu planning tips, and ordering timelines for the festival of lights.",
    keywords: ["Diwali sweets", "Putharekulu Diwali", "festival gifting", "Indian festival sweets", "Diwali food traditions"],
  },
];

export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug);
export const getBlogPostsByCategory = (category: string) => blogPosts.filter((post) => post.category === category);
export const getBlogPostsByTag = (tag: string) => blogPosts.filter((post) => post.tags.includes(tag));
export const getRecentBlogPosts = (count: number = 3) => blogPosts.slice(0, count);