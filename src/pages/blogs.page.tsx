import { useId, useState } from "react";

import { ArrowLeft, Calendar, Users } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { type BlogPost, getAllBlogPosts } from "@/lib/blog-data";

const blogPosts: BlogPost[] = getAllBlogPosts();

// Original hardcoded data removed - now fetched from MDX file
/*const blogPosts: BlogPost[] = [
  {
    id: "social-show-off-persona",
    title: "The Social Show-Off - Gen Z's Clout-Driven Buyer",
    authors: ["Pravin Shekar", "Arindam B."],
    date: "October 7, 2025",
    excerpt:
      "For some shoppers, it's about the product. For this one, it's about the post. Welcome to the world of Gen Z's Social Show-Off - Gen Z's Clout-Driven, Click-Ready Buyer.",
    content: `Co-authored by Pravin Shekar and Arindam B. 

For some shoppers, it's about the product.For this one, it's about the post. Welcome to the world of Gen Z's Social Show-Off - Gen Z's Clout-Driven, Click-Ready Buyer

Look at me! Watch me! Follow me, like me, spread me.

And come back to check out a brand new "It" tomorrow!

Who is this shopper?
They don't just buy the product. They buy the moment. The post. The flex that comes with it.
The thrill? It isn't in owning your product. The thrill is in showing they own it. On Instagram. On TikTok. In the group chat. And if your product or your packaging doesn't look good on their feed? It never happened.

Where Product Meets Persona
The Cultural Logic

They don't unbox. They unveil. Preferably with natural light and three takes.
This isn't casual consumption. This is a curated identity, one purchase at a time.
The Social Show-Off shops with their followers in mind:

Packaging = Content
Unboxing = Performance
Likes = Validation
Shares = Status
Comments = Social Currency

In their world: "If it didn't make it to the 'Gram… did it even happen?"
What Brands Need to Know
For D2C brands, here's the uncomfortable truth: A great product is expected. A shareable moment is essential.

Your product is only half the equation. The moment is what they're really buying.

If your packaging is basic? Forgettable.
If your drop feels overexposed? Old news.
If your hype feels forced? Instant unfollow.

Inside the Social Show-Off's Mindset
This shopper isn't browsing, they're curating. They're building identity through what they buy and what they share.

Your logo is a prop. Your box is a backdrop. Your product? A supporting actor.
Their triggers?

Exclusivity
Aesthetics
Hype that feels organic
Validation in the form of DMs, likes, comments
Constant visual novelty

The Playbook: Winning Over The Social Show-Off
You don't just sell to this cohort. You design for them.
What that means for your brand:

Click-worthy packaging. No plain boxes here!
FOMO-fuelled drops. They chase exclusivity.
Limited editions. Status built-in.
Organic, community-led hype. Forced trends flop.
Post-purchase experience built for sharing.

Get it right? They'll do your marketing for you.

Get it wrong? They'll ghost you and maybe drag you on TikTok for good measure.

Why Do They Behave This Way?
Gen Z grew up watching:

Unboxings
Hauls
"What's in my bag" videos
Influencer reveals

They've seen consumption become content and they want their moment too.

Purchases project identity. Social media amplifies it.
If it didn't get posted, it didn't exist!
The Brand Owner Takeaway
You thought you sold skincare. Turns out, you sell screenshots.
Because for this shopper, the product is important. 

But the post? 

That's everything.`,
  },
  {
    id: "first-in-line-buyer-persona",
    title: "The First-in-Line Buyer - Gen Z's Early Adopter",
    authors: ["Pravin Shekar", "Arindam B."],
    date: "October 7, 2025",
    excerpt:
      "In today's edition of Zcoded, we decode The First-in-Line Buyer - Gen Z's early adopter, your brand's loudest hype… and your fastest flight risk.",
    content: `Co-authored by Pravin Shekar and Arindam B. 

In today's edition of Zcoded, we decode The First-in-Line Buyer - Gen Z's early adopter, your brand's loudest hype… and your fastest flight risk. For them, novelty is loyalty and if you're not launching, you're already losing them.

The First-in-line Buyer: Gen Z's Early Adopter. Your Brand's Fastest Hype… and Hardest to Hold.
The Drop Frenzy

You announce a limited drop at 11 AM. It's 10:59. They've already refreshed twice. 11:01 - it's in their cart. 11:03 - it's on their story. No reviews. No hesitation. Just speed, screenshots, and social proof.

Think: Sneaker-heads, concert ticket bots, or launch-day gamers
Who is this shopper?
You've barely announced your new product. The samples are still warm from production. And yet… there they are. Liking. Commenting. Asking when it drops. First in line. First to buy. First to post. They don't wait for reviews. They don't ask, "Has anyone tried this yet?". They don't care. They want to be the first. But this enthusiasm comes with a price.

The Buyer Who Makes… and Breaks You

The First-in-Line Buyer: Gen Z's trend-hungry, status-driven, early adopter. They love being ahead of the curve. They're always on the lookout for the next thing. They get their high from "I got it before it went mainstream."

They can be:

Your loudest hype machine
Your best source of early feedback
Your fastest flight risk if you disappoint

This persona isn't loyal to your brand.They're loyal to novelty.
What Drives Them

Novelty over loyalty.
Social currency through early access.
Obsession with what's next, not what's better.

What They Expect

Limited drops.
Early access.
Speed and spectacle.
Flawless UX.

What They Do When Disappointed

Ghost you.
Post about it.
Move on.

In Their World: Boredom = Drop-off. Predictability = Irrelevance
For D2C Brands: The Good, The Bad, The Exhausting

As a D2C brand owner, buckle in.

Limited drops.
Surprise launches.
Speed-to-market pressure.
Messaging that screams energy and exclusivity.

But remember:

Their LTV is low.
They chase novelty, not loyalty.
If you slow down, they bounce.

If you ignore their feedback, they ghost you and tell others.

What's the Stimulus for The Beta Generation? This isn't random behaviour. It's cultural wiring!

If I'm not first, I'm late. Hype now, think later.
Gen Z grew up on: Beta tests. Early access. Pre-release culture. Soft launches.

Being first offers them Identity, Social Leverage and Control in a noisy, fast-moving world. Their feed is crowded. Their attention is fragile.

If you're not innovating, you're invisible.
How to Keep The First-in-Line Buyer Engaged?

Launch teaser → Insta story tap → buy → post unboxing → onto the next drop
Think like a creator. Act like a collaborator. Surprise them. Involve them. Keep evolving.

Your Checklist
Limited editions.
Early-bird access.
Product co-creation invites.
Launch content that feels personal, not polished.
Fast, frictionless buying experience.

Because for this persona: Novelty = Loyalty. Slow = Irrelevant. If you're not launching, you're losing them.`,
  },
  {
    id: "dopamine-drifter-persona",
    title: "The Dopamine Drifter - Mood-Driven Gen Z Shopper",
    authors: ["Pravin Shekar", "Arindam B."],
    date: "October 7, 2025",
    excerpt:
      "Continuing our attempt to decode Gen Z, in today's article, Pravin Shekar and I look at one of the most unpredictable yet familiar shopper types.",
    content: `Co-Authored by Pravin Shekar and Arindam B. 

Continuing our attempt to decode Gen Z, in today's article, Pravin Shekar and I look at one of the most unpredictable yet familiar shopper types.

Impulsive, emotion-driven and most active when the rest of us are asleep, they scroll, feel, click and buy, but just as quickly, regret kicks in if your price or return process isn't frictionless.

Who is this shopper? They're scrolling at 1 AM, bleary-eyed but wide awake. A trending reel catches their eye. A product flashes across the screen. Three seconds later, click, swipe, buy. 

Impulse purchase? Yes.
Logical decision? Not even close.
Meet The Dopamine Drifter, the mood-driven, emotionally charged Gen Z shopper who buys on instinct… and often regrets it just as fast.

D2C's Most Expensive High
For brands, this isn't just another "impulsive buyer." This is a walking dopamine loop; driven by FOMO, boredom, joy and stress. They don't browse. They don't compare. They don't read specs. They feel and when the mood hits, they buy. 

But here's the catch: What feels like a sales win can quickly spiral into regret, returns, and social media rants if the experience doesn't deliver the same high as the purchase moment.

Decoding the Drifter Psyche
Dopamine Drifters represent Gen Z's impulsive, emotion-first side. Their shopping triggers?

Mood Swings
Social media stimuli
Visual storytelling
Influencer validation 

They're nocturnal by nature, most active during late-night doom-scrolling sessions. Looking for logic or research behind their choices? Forget it. This isn't a rational shopper; this is gut instinct in action. But that same instinct turns fickle fast.

A confusing price tag? Gone.
Clunky checkout? Gone.
Complicated returns? Rant alert.

The friction threshold is nearly zero.
What Brands Need to Know
For Dopamine Drifters: You have 3–5 seconds to trigger emotional engagement. Traditional marketing funnels? Irrelevant. Post-purchase satisfaction? Momentary, handle with care. Clunky returns? Expect public regret… and maybe an Instagram takedown. Night-time engagement? Non-negotiable, that's their prime time. Loyalty programs? Only if they're gamified or emotionally rewarding.

This persona is your most spontaneous customer, and your biggest churn risk.
Why Do They Behave This Way?
Blame the algorithm. This generation grew up wired for micro-rewards: likes, swipes, follows. They live in a world of constant digital stimulation and performance pressure. Small indulgences like a new hoodie, a skincare mini, become coping mechanisms. The purchase high? Instant. The regret window? Just as fast. And trust? It's outsourced. If their favourite creator unboxed it, that's good enough. Brand stories? Only relevant if tied to identity and emotional currency.

How to Win the Dopamine Drifter
It's not about chasing the impulse. It's about designing for:

Emotion
Immediacy
Frictionless Journeys
Outsourced trust

Nail that, and this unpredictable shopper might just become your most vocal and surprisingly loyal brand advocate. Miss the mark? Well… check your returns dashboard or your DMs. They've probably told you already.

Seen this behaviour in your own brand or campaigns? Tell us how you've tackled the Dopamine Drifter; we'd love to hear your experience.`,
  },
  {
    id: "cart-skipper-persona",
    title: "The Cart Skipper - A Commitment-Phobic Gen Z Persona",
    authors: ["Pravin Shekar", "Arindam B."],
    date: "October 7, 2025",
    excerpt:
      "Welcome to the Gen-Z Coded newsletter. In this newsletter, we dive into the messy, brilliant, sometimes maddening world of Gen Z shoppers.",
    content: `Co-Authored by Pravin Shekar and Arindam B. 

Welcome to the Gen-Z Coded newsletter. In this newsletter, we dive into the messy, brilliant, sometimes maddening world of Gen Z shoppers. Here, we aren't just discussing generic marketing profiles. We'll talk about real behavioural patterns we've observed, decoded and named. As brand owners, marketers, and researchers, you're invited to agree, disagree, or debate. The goal? To spark smarter conversations around the most unpredictable generation yet.

Let's decode Gen Z. One persona at a time.

Today, we are going to talk about The Cart Skipper - a commitment-phobic Gen Z persona that loves the thrill of shopping but treats checkout like a maybe.

Who is this guy? 

He sees my product, plays with the images, asks many questions, selects the products, not one but two, and puts them in the cart. And then ghosts me! I ping him, ring him, nudge, mail, message, and call. The two items remain in the cart, lost in the desert of lost carts! What a cart skipper he turned out to be!

Similar to Julia Robert's character in "The Runaway Bride." Walking right down the aisle and then through it, leaving the hubby-to-be in a lurch!

But this isn't just one flaky shopper - it's a whole Gen Z pattern. And it's costing D2C brands big. This is the commitment-phobic shopper I invested time, effort, and ad money into - only to be ghosted!!

Presenting: The Cart Skipper Persona to the world of D2C!
When the skipper is GenZ, it makes it even more challenging to understand. In D2C, getting clicks is easy, but conversions are tough. Especially when dealing with The Cart Skipper, a Gen Z persona who loves the thrill of discovery but often fails to follow through. 

For brands, this isn't just about abandoned carts; it's about abandoned intent. Fixing this means rethinking how seamless your digital experience truly is. 

"I cart. Therefore, I am" :)
Let's dive deep into the psyche of these folks. The most prominent trait of this cohort is that, as consumers, they are curious but averse to commitment. They are enthusiastic during the discovery phase, but pushing them over the line is hard. They will constantly hop across platforms but rarely spend enough time completing the journey. Interestingly, they do not abandon carts due to disinterest but due to distraction, friction, or broken journeys!

Discovery is not an issue. The abandoning happens at the cusp of final decision-making.
As a brand owner, Loyalty is not a given for this persona.  "Add to cart" is a feel-good factor; it's a planning tool, not a sign of commitment! 

Window Shopping 2.0! Like a few other Gen Z cohorts, this group is also ease-obsessed. One second of lag, a broken button will result in instant drop-off.  Platform hoppers: they'll start on Instagram, transition to the brand website, look at reviews on Reddit, and search for discounts on marketplaces, but will end...nowhere!! 

Their cart isn't abandoned; it's been outcompeted by a rabbit hole of tabs, opinions, and distractions.
 And in all of this multi-tab browsing: Commitment is decided in milliseconds and often lost in micro-annoyances. 

Micro-behaviour Insight:

"Saving carts as wishlists": For Gen Z, the cart isn't a step toward checkout; it's an organisational tool, a comparison board, and even a mood board. 

Key implications for brands:

Omnichannel Storytelling: Traditional linear funnels do not work for this cohort. Your product narrative must be seamless across platforms. Instagram ≠ Brochure. Checkout ≠ Afterthought.
Relentless UX Discipline: One lag, one glitch, and they're gone. 
Abandoned Carts ≠ Lost Interest: They might return, but only if re-entry is fast, familiar, and frictionless. Retargeting = Non-relevant Noise, Unless Smart. For this persona, a dynamic, experience-led marketing works wonders. 

What is the stimulus for this behaviour? 

GenZ is a digital native generation! Constantly juggling between multiple tabs, platforms, and inputs all at once.  Instant gratification is a given. Any extra step or an additional click is a deal breaker. 
Unlike the FOMO cohort, this cohort fears making the wrong choice. Dropping off feels much safer than risking regret. So, too many options lead to decision-making paralysis. 
Checking out is not the end goal. Completing the purchase is optional, not essential.

To win over The Cart Skipper, stop obsessing over retargeting and start obsessing over consistency across every touchpoint. From social scroll to the checkout page, the experience must be unified, fast, and friction-free. For this persona, one second of confusion or effort is all it takes to skip the cart. 

For the Cart Skipper, checkout isn't a destination. It's just another scroll.`,
  },
];*/

export default function BlogsPage() {
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  if (selectedBlog) {
    return (
      <div
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "#eef7ded" }}
      >
        {/* Navigation */}
        <nav className="fixed top-0 z-[100] w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Company Logo"
                  className="h-10 w-auto"
                />
              </div>
              <div className="hidden items-center space-x-8 md:flex">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedBlog(null)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blogs
                </Button>
                <Button asChild variant={"secondary"}>
                  <Link to={"/login"}>Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Full Blog Content */}
        <div className="pt-24 pb-16 sm:pt-28">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Blog Image */}
            <div className="mb-8">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="h-64 w-full rounded-2xl object-cover shadow-lg sm:h-80 lg:h-96"
              />
            </div>

            {/* Blog Header */}
            <header className="mb-8 text-center">
              <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                {selectedBlog.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    Co-Authored by {selectedBlog.authors.join(" and ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{selectedBlog.date}</span>
                </div>
              </div>
            </header>

            {/* Blog Content */}
            <div className="prose prose-lg mb-12 max-w-none">
              {selectedBlog.content.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-6 text-base leading-relaxed text-gray-700 sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Call to Action Section */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#42BD00]/5 to-[#42BD00]/10 p-6 sm:p-8">
              <div className="text-center">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Ready to Decode More Gen Z Insights?
                </h3>
                <p className="mx-auto mb-6 max-w-2xl text-gray-600">
                  Join our community of forward-thinking marketers and brand
                  owners who are already using these insights to transform their
                  strategies.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    className="bg-[#42BD00] px-8 py-3 text-base font-medium text-white hover:bg-[#369900]"
                    onClick={() => setSelectedBlog(null)}
                  >
                    Explore More Blogs
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#42BD00] px-8 py-3 text-base font-medium text-[#42BD00] hover:bg-[#42BD00] hover:text-white"
                  >
                    <Link to="mailto:contactus@acutusai.com">
                      Contact us - contactus@acutusai.com
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "#eef7ded",
        fontFamily: "Alina",
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-gray-200 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/logo.png" alt="Company Logo" className="h-10 w-auto" />
            </div>
            <div className="hidden items-center space-x-8 md:flex">
              <Button asChild variant="ghost">
                <Link to="/">Home</Link>
              </Button>
              <Button asChild variant={"secondary"}>
                <Link to={"/login"}>Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="pt-24 pb-8 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* <div className="mb-4 inline-flex items-center rounded-full border border-[#42BD00]/20 bg-[#42BD00]/10 px-4 py-2 text-sm font-medium text-[#42BD00]">
              <span>Gen-Z Insights</span>
            </div> */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Z-Coded Blog
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Diving into the messy, brilliant, sometimes maddening world of Gen
              Z shoppers
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-100 to-white p-6 transition-shadow duration-300 hover:shadow-xl"
              >
                <Grid size={20} />
                <div className="relative z-20">
                  <h3 className="mb-3 text-lg leading-tight font-bold text-neutral-800">
                    {post.title}
                  </h3>
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{post.authors.join(" & ")}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <p className="mb-6 line-clamp-3 text-sm font-normal text-neutral-600">
                    {post.excerpt}
                  </p>
                  <Button
                    onClick={() => setSelectedBlog(post)}
                    className="w-full bg-[#42BD00] text-white hover:bg-[#42BD00]/90"
                  >
                    View Full Blog
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Grid Pattern Components
export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/30 to-zinc-300/30 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full fill-black/10 stroke-black/10 mix-blend-overlay"
        />
      </div>
    </div>
  );
};

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: {
  width: number;
  height: number;
  x: string;
  y: string;
  squares: number[][];
  [key: string]: unknown;
}) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map((square) => {
            const [x, y] = square;
            return (
              <rect
                strokeWidth="0"
                key={`${x}-${y}`}
                width={width + 1}
                height={height + 1}
                x={x * width}
                y={y * height}
              />
            );
          })}
        </svg>
      )}
    </svg>
  );
}
