export const context_impact_library = [
  {
    context_category: "Temporal",
    values: [
      {
        context_variable: "Time of Day",
        definition: "Energy, focus, and device-use context",
        default_weight_range:
          "Morning (+0.3), Afternoon (+0.1), Evening (+0.4), Late Night (-0.2 to +0.3)",
      },
      {
        context_variable: "Day of Week",
        definition: "Routine vs leisure mode",
        default_weight_range: "Weekday (+0.2), Weekend (+0.5)",
      },
      {
        context_variable: "Month / Season",
        definition: "Purchase motivation shifts (festivals, weather)",
        default_weight_range: "Festival (+0.8), Summer (-0.2), Winter (+0.3)",
      },
      {
        context_variable: "Pay Cycle",
        definition: "Disposable income impact",
        default_weight_range: "Pre-payday (-0.5), Payday (+0.7)",
      },
      {
        context_variable: "Recency of Exposure",
        definition: "Time since last ad/interaction",
        default_weight_range: "<24h (-0.3), 3–5 days (+0.2), >7 days (-0.2)",
      },
    ],
  },
  {
    context_category: "Environmental",
    values: [
      {
        context_variable: "Location Type",
        definition: "Urban vs Rural setting",
        default_weight_range: "Metro (+0.3), Tier-2 (+0.1), Rural (-0.4)",
      },
      {
        context_variable: "Physical Location",
        definition: "At home, commuting, workplace, shopping mall",
        default_weight_range: "Home (+0.2), Commuting (-0.4), Mall (+0.6)",
      },
      {
        context_variable: "Weather",
        definition: "Emotional & seasonal influence",
        default_weight_range: "Rainy (+0.3), Sunny (+0.4)",
      },
      {
        context_variable: "Noise Level",
        definition: "Attention disruption",
        default_weight_range: "Quiet (+0.2), Noisy (-0.4)",
      },
      {
        context_variable: "Lighting / Screen Visibility",
        definition: "Screen comfort and fatigue",
        default_weight_range: "Poor lighting (-0.2), Good lighting (+0.2)",
      },
    ],
  },
  {
    context_category: "Technological",
    values: [
      {
        context_variable: "Device Type",
        definition: "Mobile vs Desktop behavior",
        default_weight_range: "Mobile (+0.4, -0.2), Desktop (+0.5)",
      },
      {
        context_variable: "OS / Platform",
        definition: "Android vs iOS ecosystems",
        default_weight_range: "Android (+0.1), iOS (+0.3)",
      },
      {
        context_variable: "Internet Speed",
        definition: "Load time affects engagement",
        default_weight_range: "Low (-0.6), High (+0.4)",
      },
      {
        context_variable: "Battery Level",
        definition: "Decision urgency",
        default_weight_range: "<20% (-0.5, +0.2), >80% (+0.3)",
      },
      {
        context_variable: "App vs Web",
        definition: "Interface experience",
        default_weight_range: "App (+0.3, +0.4), Browser (-0.2)",
      },
      {
        context_variable: "Push Notification Context",
        definition: "Triggered entry mode",
        default_weight_range: "Organic (+0.4), Push (-0.3)",
      },
    ],
  },
  {
    context_category: "Brand & Market",
    values: [
      {
        context_variable: "Brand Awareness",
        definition: "Familiarity effect",
        default_weight_range: "High (+0.7), Medium (+0.3), Low (-0.3)",
      },
      {
        context_variable: "Brand Sentiment",
        definition: "Past perception shaping response",
        default_weight_range: "Positive (+0.6), Negative (-0.7)",
      },
      {
        context_variable: "Promotional Intensity",
        definition: "Discount, urgency, scarcity cues",
        default_weight_range:
          "Flash Sale (+0.8), Limited Offer (+0.6), None (-0.3)",
      },
      {
        context_variable: "Category Fit",
        definition: "Relevance to persona’s current interest",
        default_weight_range: "High (+0.7), Medium (+0.3), Low (-0.5)",
      },
      {
        context_variable: "Competitor Presence",
        definition: "Exposure to competitor brands",
        default_weight_range: "High (-0.5), Low (+0.2)",
      },
      {
        context_variable: "Ad Frequency / Fatigue",
        definition: "Overexposure reduces recall",
        default_weight_range: "High (-0.6), Moderate (+0.2), Low (+0.3)",
      },
      {
        context_variable: "Creative Format",
        definition: "Static vs video vs interactive",
        default_weight_range: "Static (+0.1), Video (+0.4), Interactive (+0.6)",
      },
    ],
  },
  {
    context_category: "Psychological",
    values: [
      {
        context_variable: "Mood / Emotion",
        definition: "Affects openness & decision mode",
        default_weight_range:
          "Happy (+0.4), Stressed (-0.5), Curious (+0.5), Bored (+0.3)",
      },
      {
        context_variable: "Cognitive Load",
        definition: "Multitasking / mental fatigue",
        default_weight_range: "High (-0.5), Low (+0.3)",
      },
      {
        context_variable: "Motivation Type",
        definition: "Hedonic vs Utilitarian",
        default_weight_range: "Hedonic (+0.6), Utilitarian (+0.3)",
      },
      {
        context_variable: "Risk Aversion",
        definition: "Tolerance for new/unknown brands",
        default_weight_range: "High (-0.4), Low (+0.4)",
      },
      {
        context_variable: "Self-Image Orientation",
        definition: "Self-expression vs practicality",
        default_weight_range: "Image-driven (+0.6), Practical (-0.2)",
      },
      {
        context_variable: "Temporal Mood Shift",
        definition: "Emotion decay over time",
        default_weight_range: "Strong shift (+0.4), Stable (0)",
      },
    ],
  },
  {
    context_category: "Social",
    values: [
      {
        context_variable: "Social Influence",
        definition: "Seeing friends use product",
        default_weight_range: "High (+0.8), Medium (+0.4)",
      },
      {
        context_variable: "Cultural Event / Festival",
        definition: "Shared moments drive buying",
        default_weight_range: "Major (+0.9), Minor (+0.4)",
      },
      {
        context_variable: "Social Validation Need",
        definition: "‘Show-off’ tendency",
        default_weight_range: "High (+0.7), Low (0)",
      },
      {
        context_variable: "Group Setting",
        definition: "Social visibility and conformity",
        default_weight_range: "Group (+0.5), Alone (-0.2)",
      },
      {
        context_variable: "Trend Participation",
        definition: "Viral momentum",
        default_weight_range: "Trending (+0.8), Niche (-0.1)",
      },
      {
        context_variable: "Influencer Trust Level",
        definition: "Credibility of messenger",
        default_weight_range: "High (+0.6), Low (-0.4)",
      },
      {
        context_variable: "Community Norms",
        definition: "Fit within cultural group",
        default_weight_range: "Aligns (+0.5), Conflicts (-0.6)",
      },
    ],
  },
  {
    context_category: "Meta",
    values: [
      {
        context_variable: "Previous Simulation Memory",
        definition: "How prior runs influence persona",
        default_weight_range: "Familiar (-0.2), New (+0.3)",
      },
      {
        context_variable: "AI Agent Fatigue",
        definition: "Drift simulation realism",
        default_weight_range: "High (-0.3), Fresh (+0.2)",
      },
      {
        context_variable: "Decision Momentum",
        definition: "Cumulative exposure impact",
        default_weight_range: "Positive (+0.6), Contradictory (-0.4)",
      },
    ],
  },
];
