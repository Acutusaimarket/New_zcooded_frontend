import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, State } from "country-state-city";
import {
  Bot,
  Building2,
  ChevronDown,
  Plus,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FromInput from "@/components/shared/form-input";
import FormTextArea from "@/components/shared/form-text-area";
import { LoadingSwap } from "@/components/shared/loading-swap";
import MultiSelectWithOther from "@/components/shared/multi-select-with-other";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { useGeneratePersonasLLMMutation } from "../api/mutation/use-generate-personas-llm";
import { type PersonaLLMSchema, personaLLMSchema } from "../schema";
import countryData from "./country.json";
import GeneratePersonaPreview from "./generate-persona-preview";

const industries = [
  {
    label: "Accounting",
    value: "accounting",
  },
  {
    label: "Advertising",
    value: "advertising",
  },
  {
    label: "Agriculture/Fishing",
    value: "agriculture-fishing",
  },
  {
    label: "Architecture",
    value: "architecture",
  },
  {
    label: "Automotive",
    value: "automotive",
  },
  {
    label: "Aviation",
    value: "aviation",
  },
  {
    label: "Banking/Financial",
    value: "banking-financial",
  },
  {
    label: "Bio-Tech",
    value: "bio-tech",
  },
  {
    label: "Brokerage",
    value: "brokerage",
  },
  {
    label: "Carpentry/Electrical installations",
    value: "carpentry-electrical",
  },
  {
    label: "Chemicals/Plastics/Rubber",
    value: "chemicals-plastics-rubber",
  },
  {
    label: "Communications/Information",
    value: "communications-information",
  },
  {
    label: "Computer Hardware",
    value: "computer-hardware",
  },
  {
    label: "Computer Reseller (software/hardware)",
    value: "computer-reseller",
  },
  {
    label: "Computer Software",
    value: "computer-software",
  },
  {
    label: "Construction",
    value: "construction",
  },
  {
    label: "Consulting",
    value: "consulting",
  },
  {
    label: "Consumer Electronics",
    value: "consumer-electronics",
  },
  {
    label: "Consumer Packaged Goods",
    value: "consumer-packaged-goods",
  },
  {
    label: "Education",
    value: "education",
  },
  {
    label: "Energy/Utilities/Oil and Gas",
    value: "energy-utilities-oil-gas",
  },
  {
    label: "Engineering",
    value: "engineering",
  },
  {
    label: "Environmental Services",
    value: "environmental-services",
  },
  {
    label: "Fashion/Apparel",
    value: "fashion-apparel",
  },
  {
    label: "Food/Beverage",
    value: "food-beverage",
  },
  {
    label: "Government/Public Sector",
    value: "government-public-sector",
  },
  {
    label: "Healthcare",
    value: "healthcare",
  },
  {
    label: "Hospitality/Tourism",
    value: "hospitality-tourism",
  },
  {
    label: "Human Resources",
    value: "human-resources",
  },
  {
    label: "Information Technology/IT",
    value: "information-technology",
  },
  {
    label: "Insurance",
    value: "insurance",
  },
  {
    label: "Internet",
    value: "internet",
  },
  {
    label: "Legal/Law",
    value: "legal-law",
  },
  {
    label: "Manufacturing",
    value: "manufacturing",
  },
  {
    label: "Marketing",
    value: "marketing",
  },
  {
    label: "Market Research",
    value: "market-research",
  },
  {
    label: "Media/Entertainment",
    value: "media-entertainment",
  },
  {
    label: "Military",
    value: "military",
  },
  {
    label: "Non Profit/Social services",
    value: "non-profit-social-services",
  },
  {
    label: "Personal Services",
    value: "personal-services",
  },
  {
    label: "Pharmaceuticals",
    value: "pharmaceuticals",
  },
  {
    label: "Printing Publishing",
    value: "printing-publishing",
  },
  {
    label: "Public Relations",
    value: "public-relations",
  },
  {
    label: "Real Estate/Property",
    value: "real-estate-property",
  },
  {
    label: "Retail/Wholesale trade",
    value: "retail-wholesale-trade",
  },
  {
    label: "Sales",
    value: "sales",
  },
  {
    label: "Security",
    value: "security",
  },
  {
    label: "Shipping/Distribution",
    value: "shipping-distribution",
  },
  {
    label: "Telecommunications",
    value: "telecommunications",
  },
  {
    label: "Transportation",
    value: "transportation",
  },
  {
    label: "Other",
    value: "other",
  },
  {
    label: "I don't work",
    value: "i-dont-work",
  },
];

const ageGroups = [
  {
    label: "18-24",
    value: "18-24",
  },
  {
    label: "25-34",
    value: "25-34",
  },
  {
    label: "35-44",
    value: "35-44",
  },
  {
    label: "45-54",
    value: "45-54",
  },
  {
    label: "55-64",
    value: "55-64",
  },
  {
    label: "65+",
    value: "65+",
  },
];

const budgetRanges = [
  {
    label: "Affluent / High Income",
    value: "affluent",
    description:
      "Can afford luxury purchases regularly, little/no financial stress.",
  },
  {
    label: "Upper-Middle",
    value: "upper-middle",
    description: "Comfortable, can afford some discretionary/luxury items.",
  },
  {
    label: "Middle",
    value: "middle",
    description:
      "Stable, covers essentials, occasional discretionary spending.",
  },
  {
    label: "Lower-Middle",
    value: "lower-middle",
    description: "Covers basic needs but limited discretionary spend.",
  },
  {
    label: "Lower",
    value: "lower",
    description: "Struggles to cover essentials, little/no disposable income.",
  },
];

const jobLevels = [
  {
    label: "C-Level (e.g. CEO, CFO), Owner, Partner, President",
    value: "c-level-owner-partner-president",
  },
  {
    label: "Vice President (EVP, SVP, AVP, VP)",
    value: "vice-president",
  },
  {
    label: "Director (Group Director, Sr. Director, Director)",
    value: "director",
  },
  {
    label: "Manager (Group Manager, Sr. Manager, Manager, Program Manager)",
    value: "manager",
  },
  {
    label: "Analyst",
    value: "analyst",
  },
  {
    label: "Assistant or Associate",
    value: "assistant-associate",
  },
  {
    label: "Administrative (Clerical or Support Staff)",
    value: "administrative",
  },
  {
    label: "Consultant",
    value: "consultant",
  },
  {
    label: "Intern",
    value: "intern",
  },
  {
    label: "Volunteer",
    value: "volunteer",
  },
  {
    label: "None of the above",
    value: "none-of-the-above",
  },
];

// Country search component
const CountrySearchDropdown = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<
    (typeof countryData)[0] | null
  >(countryData.find((country) => country.countryCode === value) || null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = countryData.filter(
    (country) =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country: (typeof countryData)[0]) => {
    setSelectedCountry(country);
    onChange(country.countryCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <img
                src={selectedCountry.flag}
                alt={selectedCountry.country}
                className="h-4 w-6 rounded-sm object-cover"
              />
              <span>{selectedCountry.country}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select country</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="bg-popover border-border absolute z-50 mt-1 w-full rounded-md border shadow-md">
          <div className="border-b p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <div
                key={country.countryCode}
                className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2"
                onClick={() => handleSelect(country)}
              >
                <img
                  src={country.flag}
                  alt={country.country}
                  className="h-4 w-6 rounded-sm object-cover"
                />
                <span className="text-sm">{country.country}</span>
                <span className="text-muted-foreground ml-auto text-xs">
                  {country.countryCode}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// State/City search component
const StateCityDropdown = ({
  value,
  onChange,
  countryCode,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  disabled?: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStateCity, setSelectedStateCity] = useState<{
    name: string;
    type: "state" | "city";
  } | null>(value ? { name: value, type: "state" } : null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get states and cities for the selected country
  const states = countryCode ? State.getStatesOfCountry(countryCode) || [] : [];
  const cities = countryCode ? City.getCitiesOfCountry(countryCode) || [] : [];

  // Combine states and cities with type indicator
  const stateCityOptions = [
    ...states.map((state) => ({
      name: state.name,
      type: "state" as const,
      code: state.isoCode,
    })),
    ...cities.map((city) => ({
      name: city.name,
      type: "city" as const,
      code: city.stateCode,
    })),
  ].sort((a, b) => a.name.localeCompare(b.name));

  const filteredOptions = stateCityOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: { name: string; type: "state" | "city" }) => {
    setSelectedStateCity(option);
    onChange(option.name);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Reset selection when country changes
  useEffect(() => {
    setSelectedStateCity(null);
    onChange("");
  }, [countryCode, onChange]);

  if (!countryCode) {
    return (
      <div className="border-input bg-muted text-muted-foreground flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm">
        <span>Select a country first</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedStateCity ? (
            <span className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs">
                {selectedStateCity.type}
              </span>
              <span>{selectedStateCity.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select state/city</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div className="bg-popover border-border absolute z-50 mt-1 w-full rounded-md border shadow-md">
          <div className="border-b p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Search states/cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="text-muted-foreground px-3 py-2 text-sm">
                No states/cities found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={`${option.type}-${option.name}-${index}`}
                  className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2"
                  onClick={() => handleSelect(option)}
                >
                  <span className="bg-primary/10 text-primary rounded px-2 py-1 text-xs">
                    {option.type}
                  </span>
                  <span className="text-sm">{option.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Static budget ranges based on income categories
const getBudgetRanges = () => {
  return budgetRanges;
};

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const educationLevels = [
  { label: "High School", value: "high-school" },
  { label: "Some College", value: "some-college" },
  { label: "Bachelor's Degree", value: "bachelors" },
  { label: "Master's Degree", value: "masters" },
  { label: "Doctorate/PhD", value: "doctorate" },
  { label: "Professional Degree", value: "professional" },
  { label: "Trade School", value: "trade-school" },
];

const goalsMotivations = [
  "Save money",
  "Convenience / time-saving",
  "Discover new products / trends",
  "Career growth",
  "Social recognition / status",
  "Better health / wellness",
  "Security / peace of mind",
  "Sustainability / eco-conscious choices",
  "Innovation / being first to try",
  "Personalization / tailored experiences",
  "Learning / self-improvement",
  "Family care / dependents",
  "Entertainment / enjoyment",
  "Trust / transparency",
];

const painPoints = [
  "High price / affordability issues",
  "Lack of trust in brand / service",
  "Complex checkout / sign-up process",
  "Limited payment options",
  "Poor customer support",
  "Delivery delays / logistics issues",
  "Privacy concerns / data misuse",
  "Limited availability (out-of-stock)",
  "Poor product quality / mismatch with expectations",
  "Information overload / too many choices",
  "Difficulty in comparison / lack of transparency",
  "Fear of making wrong decision",
  "Long wait times (support, delivery, service)",
  "Low personalization / irrelevant offers",
];

const decisionTriggers = [
  "Price / discount / deal",
  "Peer influence / reviews / ratings",
  "Brand reputation / trustworthiness",
  "Speed (delivery / response time)",
  "Quality / durability",
  "Convenience (easy checkout, one-click buy)",
  "Return / refund policy",
  "Customer support availability",
  "Loyalty rewards / memberships",
  "Personalization (recommendations, targeted offers)",
  "Free delivery / shipping",
  "Social media buzz / influencer endorsement",
  "Sustainability / ethical practices",
];

const preferredChannels = [
  "Mobile app",
  "Website / e-commerce platform",
  "In-store / offline retail",
  "WhatsApp / Messaging apps",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Twitter / X",
  "Call center / phone support",
  "Email",
  "Chatbot / AI assistant",
  "SMS",
  "Community forums / Reddit",
  "Influencer/blog sites",
];

const personalityTraits = [
  "Cautious",
  "Impulsive",
  "Analytical / logical",
  "Adventurous / risk-taking",
  "Detail-oriented",
  "Creative / imaginative",
  "Social / outgoing",
  "Independent",
  "Trend-seeker",
  "Loyal / consistent",
];

const values = [
  "Sustainability / eco-conscious",
  "Cost-saving / frugality",
  "Innovation / technology-driven",
  "Luxury / premium lifestyle",
  "Convenience / time-saving",
  "Family-first",
  "Community / social good",
  "Security / stability",
  "Status / recognition",
  "Freedom / independence",
  "Learning / growth",
  "Health & wellness",
];

const emotionalDrivers = [
  "Fear of Missing Out (FOMO)",
  "Trust / credibility",
  "Prestige / exclusivity",
  "Belonging / community",
  "Security / assurance",
  "Curiosity / novelty",
  "Instant gratification",
  "Nostalgia",
  "Social validation",
  "Empowerment / control",
];

const onlineOfflinePatterns = [
  "Online-first (mobile/web preference)",
  "Offline-first (in-store preference)",
  "Hybrid (research online, buy offline)",
  "Hybrid (research offline, buy online)",
  "Social-commerce heavy (Instagram/WhatsApp buying)",
];

const deviceUsage = [
  "Mobile-only",
  "Desktop-only",
  "Tablet",
  "Hybrid (multi-device)",
  "Smart devices (TV, voice assistant)",
];

const awarenessChannels = [
  "Social Media Ads",
  "Influencer/creator content",
  "Word of Mouth",
  "Search Engines",
  "TV/OTT ads",
  "In-store displays",
  "Online communities/forums",
];

const considerationFactors = [
  "Peer reviews / ratings",
  "Expert opinions / comparison sites",
  "Free trials / demos",
  "Brand reputation",
  "Price comparison",
  "Social validation (friends using it)",
];

const decisionFactors = [
  "Discounts / offers",
  "Free delivery",
  "Easy checkout",
  "Brand trust",
  "Return/refund policy",
  "Loyalty/reward points",
];

const loyaltyFactors = [
  "Subscription model",
  "Loyalty rewards / membership",
  "Consistent quality",
  "Excellent support",
  "Personalized offers",
  "Emotional connection with brand values",
];

const preferredApps = [
  "Amazon / Flipkart",
  "Swiggy / Zomato",
  "Nykaa / Myntra",
  "Ola / Uber",
  "Paytm / Google Pay",
  "Netflix / Hotstar / Prime",
  "Meesho / Ajio",
  "Spotify / Gaana",
];

const socialPlatforms = [
  "Instagram",
  "WhatsApp",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Twitter / X",
  "Reddit",
  "Snapchat",
  "Telegram",
];

const contentFormats = [
  "Short videos (Reels, TikTok, Shorts)",
  "Long-form videos (YouTube, OTT shows)",
  "Articles / blogs",
  "Podcasts",
  "Memes / viral content",
  "News bites",
  "Email newsletters",
];

const CreatePersonaAI = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [psychographicsOpen, setPsychographicsOpen] = useState(false);
  const [contextualBehaviorOpen, setContextualBehaviorOpen] = useState(false);
  const [journeyMappingOpen, setJourneyMappingOpen] = useState(false);
  const [techMediaOpen, setTechMediaOpen] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);
  const form = useForm({
    resolver: zodResolver(personaLLMSchema),
    defaultValues: {
      // Product Information
      product_name: "",
      product_description: "",
      industry: "",
      business_goal: "",

      // Demographics
      age_group: [],
      gender: [],
      state_city: "",
      location: "",
      education_level: [],
      occupation: [],
      budget: [],

      // Core Drivers
      goals_motivations: [],
      custom_goal: "",
      pain_points: [],
      custom_pain_point: "",
      decision_triggers: [],
      custom_trigger: "",
      preferred_channels: [],
      custom_channel: "",

      // Optional sections
      personality_traits: [],
      custom_personality: "",
      values: [],
      emotional_drivers: [],
      weekday_habits: "",
      weekend_habits: "",
      online_offline_patterns: [],
      device_usage: [],
      awareness_channels: [],
      consideration_factors: [],
      decision_factors: [],
      loyalty_factors: [],
      preferred_apps: [],
      social_platforms: [],
      content_formats: [],
      brand_affinities: "",
      persona_quotes: "",

      // Legacy fields
      city_tier: "",
      customer_description: "",
      additional_requirements: "",

      // AI Configuration
      model: "gpt-5" as const,
      no_of_personas: 4,
    },
  });

  const mutation = useGeneratePersonasLLMMutation();

  // Helper functions for multi-select
  const toggleArrayValue = (field: keyof PersonaLLMSchema, value: string) => {
    const currentValues = (form.getValues(field) as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    form.setValue(field, newValues as string[]);
  };

  const addCustomValue = (
    field: keyof PersonaLLMSchema,
    customField: keyof PersonaLLMSchema
  ) => {
    const customValue = form.getValues(customField) as string;
    if (customValue && customValue.trim()) {
      const currentValues = (form.getValues(field) as string[]) || [];
      form.setValue(field, [...currentValues, customValue.trim()] as string[]);
      form.setValue(customField, "" as string);
    }
  };

  const removeValue = (field: keyof PersonaLLMSchema, value: string) => {
    const currentValues = (form.getValues(field) as string[]) || [];
    form.setValue(
      field,
      currentValues.filter((v: string) => v !== value) as string[]
    );
  };

  const onSubmit = (data: PersonaLLMSchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        setIsCollapsed(false);
        previewRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    });
  };

  return (
    <>
      <Card className="from-background to-muted/20 border-0 bg-gradient-to-br shadow-lg">
        <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed}>
          <CollapsibleTrigger className="flex w-full items-start justify-between px-2">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary h-6 w-6" />
                <CardTitle className="text-2xl">
                  Generate Your Persona
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Fill in the details below to create a comprehensive customer
                persona using advanced AI technology
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, (err) => {
                    Object.entries(err).forEach(([key, value]) => {
                      toast.error(
                        `${key.replace(/_/g, " ")}:- ${value.message}`
                      );
                    });
                  })}
                  className="space-y-8"
                >
                  {/* Demographics */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2">
                      <Target className="text-primary h-5 w-5" />
                      <h3 className="text-xl font-semibold">Demographics</h3>
                    </div>
                    <Separator className="mb-4" />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="age_group"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Age Group</FormLabel>
                            <FormControl>
                              <MultiSelectWithOther
                                value={(field.value as string[]) || []}
                                onChange={field.onChange}
                                options={ageGroups}
                                placeholder="Select age groups"
                                disabled={mutation.isPending}
                                otherLabel="Other age group"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Gender</FormLabel>
                            <FormControl>
                              <MultiSelectWithOther
                                value={(field.value as string[]) || []}
                                onChange={field.onChange}
                                options={genders}
                                placeholder="Select genders"
                                disabled={mutation.isPending}
                                otherLabel="Other gender"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Country</FormLabel>
                            <FormControl>
                              <CountrySearchDropdown
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  setSelectedCountryCode(value);
                                }}
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state_city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/City</FormLabel>
                            <FormControl>
                              <StateCityDropdown
                                value={field.value || ""}
                                onChange={field.onChange}
                                countryCode={selectedCountryCode || ""}
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="education_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Education Level</FormLabel>
                            <FormControl>
                              <MultiSelectWithOther
                                value={(field.value as string[]) || []}
                                onChange={field.onChange}
                                options={educationLevels}
                                placeholder="Select education levels"
                                disabled={mutation.isPending}
                                otherLabel="Other education level"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div></div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              Occupation / Job Level
                            </FormLabel>
                            <FormControl>
                              <MultiSelectWithOther
                                value={(field.value as string[]) || []}
                                onChange={field.onChange}
                                options={jobLevels}
                                placeholder="Select occupations / job levels"
                                disabled={mutation.isPending}
                                otherLabel="Other occupation"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>
                              Household financial situation
                            </FormLabel>
                            <FormControl>
                              <MultiSelectWithOther
                                value={(field.value as string[]) || []}
                                onChange={field.onChange}
                                options={getBudgetRanges()}
                                placeholder="Select household financial situations"
                                disabled={mutation.isPending}
                                otherLabel="Other financial situation"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Core Drivers */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2">
                      <Users className="text-primary h-5 w-5" />
                      <h3 className="text-xl font-semibold">
                        Core Drivers (Mandatory)
                      </h3>
                    </div>
                    <Separator className="mb-4" />

                    {/* Goals & Motivations */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">
                        Goals & Motivations
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        What this persona is trying to achieve — personal or
                        professional
                      </p>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {goalsMotivations.map((goal) => (
                          <label
                            key={goal}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={
                                form
                                  .watch("goals_motivations")
                                  ?.includes(goal) || false
                              }
                              onChange={() =>
                                toggleArrayValue("goals_motivations", goal)
                              }
                              disabled={mutation.isPending}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{goal}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FromInput
                          control={form.control}
                          name="custom_goal"
                          label=""
                          placeholder="Add custom goal..."
                          disabled={mutation.isPending}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addCustomValue("goals_motivations", "custom_goal")
                          }
                          disabled={mutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form
                          .watch("goals_motivations")
                          ?.map((goal: string) => (
                            <span
                              key={goal}
                              className="bg-primary/10 flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                            >
                              {goal}
                              <button
                                type="button"
                                onClick={() =>
                                  removeValue("goals_motivations", goal)
                                }
                                disabled={mutation.isPending}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Pain Points & Challenges */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">
                        Pain Points / Challenges
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        What frustrates or blocks them
                      </p>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {painPoints.map((painPoint) => (
                          <label
                            key={painPoint}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={
                                form
                                  .watch("pain_points")
                                  ?.includes(painPoint) || false
                              }
                              onChange={() =>
                                toggleArrayValue("pain_points", painPoint)
                              }
                              disabled={mutation.isPending}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{painPoint}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FromInput
                          control={form.control}
                          name="custom_pain_point"
                          label=""
                          placeholder="Add custom challenge..."
                          disabled={mutation.isPending}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addCustomValue("pain_points", "custom_pain_point")
                          }
                          disabled={mutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.watch("pain_points")?.map((painPoint: string) => (
                          <span
                            key={painPoint}
                            className="bg-destructive/10 flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                          >
                            {painPoint}
                            <button
                              type="button"
                              onClick={() =>
                                removeValue("pain_points", painPoint)
                              }
                              disabled={mutation.isPending}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Decision Triggers */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Decision Triggers</h4>
                      <p className="text-muted-foreground text-sm">
                        Factors that make them say "yes" or "no"
                      </p>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {decisionTriggers.map((trigger) => (
                          <label
                            key={trigger}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={
                                form
                                  .watch("decision_triggers")
                                  ?.includes(trigger) || false
                              }
                              onChange={() =>
                                toggleArrayValue("decision_triggers", trigger)
                              }
                              disabled={mutation.isPending}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{trigger}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FromInput
                          control={form.control}
                          name="custom_trigger"
                          label=""
                          placeholder="Add custom trigger..."
                          disabled={mutation.isPending}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addCustomValue(
                              "decision_triggers",
                              "custom_trigger"
                            )
                          }
                          disabled={mutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form
                          .watch("decision_triggers")
                          ?.map((trigger: string) => (
                            <span
                              key={trigger}
                              className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm"
                            >
                              {trigger}
                              <button
                                type="button"
                                onClick={() =>
                                  removeValue("decision_triggers", trigger)
                                }
                                disabled={mutation.isPending}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Preferred Channels */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">
                        Preferred Channels
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Where they interact or make decisions
                      </p>
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {preferredChannels.map((channel) => (
                          <label
                            key={channel}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={
                                form
                                  .watch("preferred_channels")
                                  ?.includes(channel) || false
                              }
                              onChange={() =>
                                toggleArrayValue("preferred_channels", channel)
                              }
                              disabled={mutation.isPending}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{channel}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <FromInput
                          control={form.control}
                          name="custom_channel"
                          label=""
                          placeholder="Add custom channel..."
                          disabled={mutation.isPending}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            addCustomValue(
                              "preferred_channels",
                              "custom_channel"
                            )
                          }
                          disabled={mutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form
                          .watch("preferred_channels")
                          ?.map((channel: string) => (
                            <span
                              key={channel}
                              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm"
                            >
                              {channel}
                              <button
                                type="button"
                                onClick={() =>
                                  removeValue("preferred_channels", channel)
                                }
                                disabled={mutation.isPending}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Optional Enrichment Sections */}

                  {/* Psychographics */}
                  <Collapsible
                    open={psychographicsOpen}
                    onOpenChange={setPsychographicsOpen}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">
                          Psychographics (Optional)
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${psychographicsOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-4">
                      {/* Personality Traits */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Personality</h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {personalityTraits.map((trait) => (
                            <label
                              key={trait}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("personality_traits")
                                    ?.includes(trait) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("personality_traits", trait)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{trait}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <FromInput
                            control={form.control}
                            name="custom_personality"
                            label=""
                            placeholder="Add custom personality trait..."
                            disabled={mutation.isPending}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              addCustomValue(
                                "personality_traits",
                                "custom_personality"
                              )
                            }
                            disabled={mutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Values */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Values</h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {values.map((value) => (
                            <label
                              key={value}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form.watch("values")?.includes(value) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("values", value)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{value}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Emotional Drivers */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Emotional Drivers
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {emotionalDrivers.map((driver) => (
                            <label
                              key={driver}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("emotional_drivers")
                                    ?.includes(driver) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("emotional_drivers", driver)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{driver}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Contextual Behavior */}
                  <Collapsible
                    open={contextualBehaviorOpen}
                    onOpenChange={setContextualBehaviorOpen}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">
                          Contextual Behavior (Optional)
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${contextualBehaviorOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormTextArea
                          control={form.control}
                          name="weekday_habits"
                          label="Weekday Habits"
                          placeholder="e.g., Morning researcher, daytime decision-maker"
                          rows={3}
                          disabled={mutation.isPending}
                        />
                        <FormTextArea
                          control={form.control}
                          name="weekend_habits"
                          label="Weekend Habits"
                          placeholder="e.g., Weekend explorer, impulsive buyer"
                          rows={3}
                          disabled={mutation.isPending}
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Online vs. Offline Patterns
                        </h4>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {onlineOfflinePatterns.map((pattern) => (
                            <label
                              key={pattern}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("online_offline_patterns")
                                    ?.includes(pattern) || false
                                }
                                onChange={() =>
                                  toggleArrayValue(
                                    "online_offline_patterns",
                                    pattern
                                  )
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{pattern}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Device Usage</h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {deviceUsage.map((device) => (
                            <label
                              key={device}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("device_usage")
                                    ?.includes(device) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("device_usage", device)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{device}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Journey Mapping */}
                  <Collapsible
                    open={journeyMappingOpen}
                    onOpenChange={setJourneyMappingOpen}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="font-medium">
                          Journey Mapping (Optional)
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${journeyMappingOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Awareness (where they discover)
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {awarenessChannels.map((channel) => (
                            <label
                              key={channel}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("awareness_channels")
                                    ?.includes(channel) || false
                                }
                                onChange={() =>
                                  toggleArrayValue(
                                    "awareness_channels",
                                    channel
                                  )
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{channel}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Consideration (what influences them)
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {considerationFactors.map((factor) => (
                            <label
                              key={factor}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("consideration_factors")
                                    ?.includes(factor) || false
                                }
                                onChange={() =>
                                  toggleArrayValue(
                                    "consideration_factors",
                                    factor
                                  )
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{factor}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Decision (purchase triggers)
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {decisionFactors.map((factor) => (
                            <label
                              key={factor}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("decision_factors")
                                    ?.includes(factor) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("decision_factors", factor)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{factor}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Loyalty/Retention (what keeps them coming back)
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {loyaltyFactors.map((factor) => (
                            <label
                              key={factor}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("loyalty_factors")
                                    ?.includes(factor) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("loyalty_factors", factor)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{factor}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Tech/Media Usage */}
                  <Collapsible
                    open={techMediaOpen}
                    onOpenChange={setTechMediaOpen}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <span className="font-medium">
                          Tech/Media Usage (Optional)
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${techMediaOpen ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Preferred Apps</h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {preferredApps.map((app) => (
                            <label
                              key={app}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form.watch("preferred_apps")?.includes(app) ||
                                  false
                                }
                                onChange={() =>
                                  toggleArrayValue("preferred_apps", app)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{app}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Social Platforms
                        </h4>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {socialPlatforms.map((platform) => (
                            <label
                              key={platform}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("social_platforms")
                                    ?.includes(platform) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("social_platforms", platform)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{platform}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">
                          Content Format Preferences
                        </h4>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {contentFormats.map((format) => (
                            <label
                              key={format}
                              className="flex cursor-pointer items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  form
                                    .watch("content_formats")
                                    ?.includes(format) || false
                                }
                                onChange={() =>
                                  toggleArrayValue("content_formats", format)
                                }
                                disabled={mutation.isPending}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{format}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <FormTextArea
                        control={form.control}
                        name="brand_affinities"
                        label="Brand Affinities"
                        placeholder="Which brands/products they admire or use (free text)"
                        rows={3}
                        disabled={mutation.isPending}
                      />

                      <FormTextArea
                        control={form.control}
                        name="persona_quotes"
                        label="Quotes"
                        placeholder="How would this persona express themselves?"
                        rows={3}
                        disabled={mutation.isPending}
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Product Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2">
                      <Building2 className="text-primary h-5 w-5" />
                      <h3 className="text-xl font-semibold">
                        Brand Affinities
                      </h3>
                    </div>
                    <Separator className="mb-4" />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FromInput
                        control={form.control}
                        name="product_name"
                        label="Brand Name"
                        placeholder="Enter Brand name"
                        disabled={mutation.isPending}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={mutation.isPending}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((industry) => (
                                  <SelectItem
                                    key={industry.value}
                                    value={industry.value}
                                  >
                                    {industry.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormTextArea
                      control={form.control}
                      name="product_description"
                      label="Brand Description"
                      placeholder="Describe your Brand in detail - features, benefits, and unique selling points"
                      rows={5}
                      disabled={mutation.isPending}
                    />
                    {/* 
                    <FormTextArea
                      control={form.control}
                      name="business_goal"
                      label="Business Goal"
                      placeholder="What is your primary business objective? (e.g., increase sales, brand awareness, customer retention)"
                      
                      rows={5}
                      className="min-h-[100px]"
                      disabled={mutation.isPending}
                    /> */}
                  </div>

                  {/* AI Model Selection */}
                  <div className="space-y-6">
                    {/* <div className="flex items-center gap-3 pb-2">
                      <Bot className="text-primary h-5 w-5" />
                      <h3 className="text-xl font-semibold">
                        AI Model Selection
                      </h3>
                    </div> */}
                    {/* <Separator className="mb-4" /> */}

                    <div className="">
                      <FromInput
                        control={form.control}
                        name="no_of_personas"
                        label="Number of Personas"
                        placeholder="Enter number of personas to generate"
                        required
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        description="Specify how many personas you want to generate."
                        disabled={mutation.isPending}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-12 w-full bg-gradient-to-r text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                      disabled={mutation.isPending}
                    >
                      <LoadingSwap
                        className="flex items-center justify-center gap-0.5"
                        isLoading={mutation.isPending}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate AI Persona
                      </LoadingSwap>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <div className="mt-4" ref={previewRef}>
        {mutation.isSuccess && mutation.data && (
          <GeneratePersonaPreview generateResult={mutation.data?.data || []} />
        )}
      </div>
    </>
  );
};

export default CreatePersonaAI;
