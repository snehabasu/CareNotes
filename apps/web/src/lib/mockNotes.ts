import type { FullCaseNote, ApprovedCaseNote } from "@carenotes/shared";
import { saveNotesBatch } from "./noteStorage";

export type MockNote = {
  id: string;
  visitId: string;
  patientName: string;
  initials: string;
  avatarColor: string;
  time: string;
  tags: string[];
  status: "draft" | "approved";
};

export type NoteGroup = {
  label: string;
  notes: MockNote[];
};

export type SessionSummary = {
  visitId: string;
  date: Date;
  dateLabel: string;   // "Today", "Feb 25", etc.
  time: string;        // "12:21pm"
  status: "draft" | "approved";
  tags: string[];      // first 3 stress flag keywords
  highCount: number;
  mediumCount: number;
  lowCount: number;
};

export type PatientGroup = {
  patientName: string;
  initials: string;
  avatarColor: string;
  lastSessionDate: Date;
  lastSessionLabel: string; // "Today at 12:21pm"
  totalSessions: number;
  peakSeverity: "high" | "medium" | "low" | "none";
  sessions: SessionSummary[]; // oldest → newest (chart order)
};

export const mockPatients = [
  { name: "Lisa Smith", initials: "LS", avatarColor: "bg-teal-light" },
  { name: "Jennifer Simpson", initials: "JS", avatarColor: "bg-amber" },
  { name: "Jonny Clarkson", initials: "JC", avatarColor: "bg-teal" },
  { name: "Sarah Mitchell", initials: "SM", avatarColor: "bg-surface-hover" },
  { name: "David Okafor", initials: "DO", avatarColor: "bg-teal-lighter" },
  { name: "Marcus Webb", initials: "MW", avatarColor: "bg-red-100" },
  { name: "Priya Nair", initials: "PN", avatarColor: "bg-purple-100" },
  { name: "Carlos Rivera", initials: "CR", avatarColor: "bg-orange-100" },
];

export const mockNoteGroups: NoteGroup[] = [
  {
    label: "Today",
    notes: [
      {
        id: "1",
        visitId: "visit_demo_lisa_today",
        patientName: "Lisa Smith",
        initials: "LS",
        avatarColor: "bg-teal-light",
        time: "12:21pm",
        tags: ["Foot Fx", "Pain"],
        status: "draft",
      },
      {
        id: "2",
        visitId: "visit_demo_jennifer_today",
        patientName: "Jennifer Simpson",
        initials: "JS",
        avatarColor: "bg-amber",
        time: "10:45am",
        tags: ["PTSD", "Anxiety"],
        status: "approved",
      },
      {
        id: "3",
        visitId: "visit_demo_jonny_today",
        patientName: "Jonny Clarkson",
        initials: "JC",
        avatarColor: "bg-teal",
        time: "9:15am",
        tags: ["Intake", "Housing"],
        status: "draft",
      },
    ],
  },
  {
    label: "Yesterday",
    notes: [
      {
        id: "4",
        visitId: "visit_demo_sarah_yesterday",
        patientName: "Sarah Mitchell",
        initials: "SM",
        avatarColor: "bg-surface-hover",
        time: "4:00pm",
        tags: ["Crisis", "Safety Plan"],
        status: "approved",
      },
      {
        id: "5",
        visitId: "visit_demo_david_yesterday",
        patientName: "David Okafor",
        initials: "DO",
        avatarColor: "bg-teal-lighter",
        time: "11:30am",
        tags: ["Follow-up", "Medication"],
        status: "approved",
      },
    ],
  },
  {
    label: "Feb 25",
    notes: [
      {
        id: "6",
        visitId: "visit_demo_lisa_feb25",
        patientName: "Lisa Smith",
        initials: "LS",
        avatarColor: "bg-teal-light",
        time: "3:00pm",
        tags: ["Group Session", "Coping Skills"],
        status: "draft",
      },
    ],
  },
];

// --- Dummy FullCaseNote data (drafts) ---

const draftLisaToday: FullCaseNote = {
  visitId: "visit_demo_lisa_today",
  patientName: "Lisa Smith",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: new Date().toISOString(),
  transcript:
    "Clinician: Good afternoon, Lisa. How have you been since our last visit?\nClient: Hi. Not great, honestly. My foot is still really bothering me. The pain has been worse this week, especially at night.\nClinician: I'm sorry to hear that. Can you describe the pain?\nClient: It's a sharp, throbbing pain around the fracture site. I've been trying to stay off it, but it's hard with everything going on.\nClinician: Are you still using the crutches?\nClient: Yes, but they hurt my hands. I'm exhausted from it all.\nClinician: Let's talk about pain management strategies and see if we need to adjust anything.",
  narrativeSummary:
    "Client presented for a follow-up regarding a foot fracture sustained two weeks ago. Client reports worsening pain, particularly at night, and difficulty with mobility despite use of crutches. Client expressed fatigue related to limited mobility. Clinician discussed pain management options and coping strategies for activity limitations.",
  soap: {
    subjective:
      "Client reports worsening pain at the fracture site, particularly at night. States 'It's a sharp, throbbing pain.' Reports difficulty using crutches due to hand discomfort. Expresses fatigue and frustration with limited mobility.",
    objective:
      "Client appeared fatigued but alert and oriented x4. Affect congruent with reported mood. Client was using crutches appropriately. No signs of acute distress. Foot still in walking boot per orthopedic instructions.",
    assessment:
      "Client continues to recover from left foot fracture with increasing pain that may require reassessment. Adjustment to temporary disability is a psychosocial stressor. No safety concerns at this time.",
    plan:
      "1. Coordinate with primary care regarding pain management.\n2. Introduce relaxation techniques for pain coping.\n3. Discuss activity modifications for daily functioning.\n4. Follow-up appointment in one week.",
  },
  psychosocial: {
    crisisReason: {
      value: "Pain from foot fracture impacting daily functioning and sleep quality.",
      confidence: "high",
    },
    substanceUse: {
      value: "No substance use concerns reported.",
      confidence: "medium",
    },
    longevityOfIssues: {
      value: "Foot fracture occurred 2 weeks ago. Pain has been worsening over the past week.",
      confidence: "high",
    },
    aggressionHistory: {
      value: "No history of aggression reported.",
      confidence: "medium",
    },
    supportSystems: {
      value: "Client has a supportive spouse who assists with daily activities.",
      confidence: "high",
    },
    pastInterventions: {
      value: "Client has attended physical therapy in the past for a previous knee injury.",
      confidence: "medium",
    },
  },
  stressFlags: [
    { keyword: "chronic pain", severity: "high", context: "Client reports worsening foot fracture pain." },
    { keyword: "sleep disturbance", severity: "medium", context: "Pain is disrupting client's sleep." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: [
      "Session focused on pain coping and psychosocial adjustment to temporary disability.",
    ],
  },
  icdCodes: [
    { code: "M84.372A", description: "Stress fracture, left ankle and foot, initial encounter", confidence: "high" },
    { code: "Z96.641", description: "Presence of right artificial hip joint", confidence: "low" },
  ],
  followUpQuestions: [
    { question: "Has pain management changed since the last visit, and are you using any over-the-counter medications?", rationale: "Assessing current pain regimen helps coordinate care with primary physician." },
    { question: "How is the limited mobility affecting your mood and daily routine?", rationale: "Adjustment to physical limitation is a key psychosocial stressor warranting monitoring." },
  ],
};

const draftJonnyToday: FullCaseNote = {
  visitId: "visit_demo_jonny_today",
  patientName: "Jonny Clarkson",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: new Date().toISOString(),
  transcript:
    "Clinician: Hi Jonny, welcome. This is your intake session, so I'd like to learn a bit about what brings you here today.\nClient: Yeah, thanks. I've been having a really hard time finding stable housing. I got evicted about two months ago and I've been couch surfing since then.\nClinician: That sounds very stressful. How has that been affecting you?\nClient: I can't focus on anything. I feel like I'm always in survival mode. I can't even look for a job properly because I don't have a stable address.\nClinician: Are you currently connected with any housing assistance programs?\nClient: I applied to one but haven't heard back. I don't really know what else is out there.",
  narrativeSummary:
    "Client presented for an intake session. Client reports housing instability following eviction two months ago, currently couch surfing. Client describes difficulty concentrating, persistent survival-mode thinking, and inability to pursue employment without stable housing. Client has applied to one housing assistance program but is not aware of other available resources.",
  soap: {
    subjective:
      "Client reports housing instability for 2 months following eviction. States he has been couch surfing. Reports difficulty concentrating, feeling 'always in survival mode,' and inability to seek employment. Applied to one housing program with no response yet.",
    objective:
      "Client appeared anxious but cooperative. Alert and oriented x4. Speech was pressured at times when discussing housing situation. Affect anxious, congruent with content. Grooming appropriate. No safety concerns identified during intake.",
    assessment:
      "Client presents with adjustment disorder with mixed anxiety and depressed mood (F43.23) secondary to housing instability. Psychosocial stressors are significant. Risk level currently low but situation is destabilizing.",
    plan:
      "1. Complete full psychosocial assessment at next visit.\n2. Provide resource list for housing assistance programs.\n3. Refer to case management for housing coordination.\n4. Schedule weekly sessions.\n5. Screen for depression and anxiety with standardized measures at next visit.",
  },
  psychosocial: {
    crisisReason: {
      value: "Housing instability following eviction, impacting ability to function and seek employment.",
      confidence: "high",
    },
    substanceUse: {
      value: "Not assessed during this intake session.",
      confidence: "insufficient_data",
    },
    longevityOfIssues: {
      value: "Housing instability began 2 months ago following eviction.",
      confidence: "high",
    },
    aggressionHistory: {
      value: "Not assessed during intake.",
      confidence: "insufficient_data",
    },
    supportSystems: {
      value: "Client has friends willing to let him stay temporarily. No family support mentioned.",
      confidence: "medium",
    },
    pastInterventions: {
      value: "No prior mental health treatment reported.",
      confidence: "medium",
    },
  },
  stressFlags: [
    { keyword: "housing instability", severity: "high", context: "Client evicted 2 months ago, couch surfing." },
    { keyword: "unemployment", severity: "medium", context: "Cannot pursue employment without stable address." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [
      "Do not document specific addresses or names of individuals providing temporary housing.",
    ],
    insurancePhrasing: [
      "Intake session for adjustment disorder with psychosocial stressors related to housing.",
    ],
  },
  icdCodes: [
    { code: "F43.23", description: "Adjustment disorder with mixed anxiety and depressed mood", confidence: "high" },
    { code: "Z59.0", description: "Homelessness", confidence: "high" },
    { code: "Z56.0", description: "Unemployment, unspecified", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "Have you received any response from the housing assistance program you applied to?", rationale: "Monitoring housing application status is critical to case management planning." },
    { question: "Can you tell me more about your support network — who you are staying with and their capacity to continue hosting?", rationale: "Assessing housing stability timeline informs urgency of intervention." },
    { question: "Have you experienced any symptoms of depression or anxiety beyond difficulty concentrating?", rationale: "Intake did not fully screen for depression/anxiety; standardized assessment is warranted." },
  ],
};

const draftLisaFeb25: FullCaseNote = {
  visitId: "visit_demo_lisa_feb25",
  patientName: "Lisa Smith",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: "2026-02-25T15:00:00.000Z",
  transcript:
    "Clinician: Welcome back to group, everyone. Lisa, would you like to share how your week went?\nClient: Sure. I tried the deep breathing exercise we talked about last session. It actually helped when I was feeling overwhelmed at the pharmacy.\nClinician: That's great progress. Can you tell the group more about that situation?\nClient: I was waiting in line and started feeling really anxious, so I did the 4-7-8 breathing. It didn't make the anxiety go away completely, but I felt more in control.\nClinician: That's exactly how coping skills work — they give you tools to manage the intensity.",
  narrativeSummary:
    "Client participated in group therapy session focused on coping skills practice. Client reported successfully using deep breathing (4-7-8 technique) during an anxiety episode at a pharmacy. Client demonstrated improved understanding of coping skill application and shared experience with group.",
  soap: {
    subjective:
      "Client reports using 4-7-8 breathing technique learned in previous session during an anxiety episode at a pharmacy. States it helped her feel 'more in control' though anxiety was not eliminated. Expressed willingness to continue practicing coping strategies.",
    objective:
      "Client was an active participant in group session. Shared personal experience voluntarily. Affect was calm, mood appeared improved from previous sessions. Engaged positively with other group members.",
    assessment:
      "Client is making progress with coping skills acquisition. Ability to apply techniques in real-world settings indicates skill generalization. Anxiety symptoms persisting but becoming more manageable.",
    plan:
      "1. Continue group therapy sessions weekly.\n2. Introduce grounding techniques as additional coping tools.\n3. Encourage continued practice of breathing exercises.\n4. Individual session follow-up as needed.",
  },
  psychosocial: {
    crisisReason: {
      value: "Ongoing anxiety management; no acute crisis at this time.",
      confidence: "high",
    },
    substanceUse: {
      value: "No substance use reported in group setting.",
      confidence: "medium",
    },
    longevityOfIssues: {
      value: "Anxiety issues have been present for several months per previous documentation.",
      confidence: "medium",
    },
    aggressionHistory: {
      value: "No aggression history noted.",
      confidence: "medium",
    },
    supportSystems: {
      value: "Group therapy peers serve as additional support system.",
      confidence: "medium",
    },
    pastInterventions: {
      value: "Currently engaged in group therapy. Previously in individual sessions.",
      confidence: "high",
    },
  },
  stressFlags: [
    { keyword: "anxiety", severity: "medium", context: "Ongoing anxiety with improving coping." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: [
      "Group therapy session focused on evidence-based coping skills training and practice.",
    ],
  },
  icdCodes: [
    { code: "F41.1", description: "Generalized anxiety disorder", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "In which other situations this week did you experience anxiety, and did you attempt the coping techniques?", rationale: "Tracking generalization of skills across settings informs treatment effectiveness." },
    { question: "On a scale of 1–10, how would you rate your overall anxiety level this week compared to the previous week?", rationale: "Quantifying symptom trajectory supports outcome monitoring and insurance documentation." },
  ],
};

// --- Dummy ApprovedCaseNote data ---

const approvedJenniferToday: ApprovedCaseNote = {
  visitId: "visit_demo_jennifer_today",
  patientName: "Jennifer Simpson",
  isDraft: false,
  approvedAtIso: new Date().toISOString(),
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Jennifer, how have you been managing since our last session?\nClient: It's been rough. I had a nightmare again about the incident. Woke up in a cold sweat.\nClinician: I'm sorry to hear that. How often are the nightmares occurring now?\nClient: About three times this week. During the day, I get these flashbacks too, especially when I hear loud noises.\nClinician: We've been working on the grounding techniques. Were you able to use them when the flashbacks happened?\nClient: Sometimes. The 5-4-3-2-1 thing helps a bit, but in the moment it's hard to remember.\nClinician: That's very normal. Let's keep practicing and talk about some additional strategies today.",
  narrativeSummary:
    "Client presented for ongoing PTSD treatment. Reports continued nightmares (3 times this week) and daytime flashbacks triggered by loud noises. Client is partially utilizing grounding techniques (5-4-3-2-1 method) but reports difficulty accessing them during acute episodes. Session focused on reinforcing existing coping strategies and introducing additional trauma-informed interventions.",
  soap: {
    subjective:
      "Client reports nightmares approximately 3 times per week related to traumatic incident. Describes daytime flashbacks triggered by loud noises. States grounding technique (5-4-3-2-1) is 'sometimes' helpful but difficult to access during acute episodes. Denies suicidal ideation.",
    objective:
      "Client appeared tired but engaged. Affect was constricted when discussing trauma content, brightened when discussing coping successes. Alert and oriented x4. No psychomotor abnormalities. Hypervigilance noted when office door closed unexpectedly.",
    assessment:
      "PTSD (F43.10) with ongoing re-experiencing symptoms. Nightmares and flashbacks remain frequent but client is developing coping repertoire. Treatment response is gradual. Risk level remains moderate due to symptom severity.",
    plan:
      "1. Continue weekly trauma-focused therapy.\n2. Introduce cognitive processing therapy techniques.\n3. Reinforce grounding skills with written cue card for client to carry.\n4. Discuss sleep hygiene strategies for nightmare management.\n5. Reassess symptom severity with PCL-5 at next session.",
  },
  psychosocial: {
    crisisReason: {
      value: "PTSD symptoms including nightmares and flashbacks impacting sleep and daily functioning.",
      confidence: "high",
    },
    substanceUse: {
      value: "No current substance use reported.",
      confidence: "medium",
    },
    longevityOfIssues: {
      value: "PTSD symptoms began approximately 8 months ago following traumatic incident.",
      confidence: "high",
    },
    aggressionHistory: {
      value: "No aggression history reported.",
      confidence: "medium",
    },
    supportSystems: {
      value: "Client has a supportive partner and attends a peer support group biweekly.",
      confidence: "high",
    },
    pastInterventions: {
      value: "Client has been in individual therapy for 4 months. Previously tried medication (SSRI) with partial response.",
      confidence: "high",
    },
  },
  stressFlags: [
    { keyword: "PTSD", severity: "high", context: "Active PTSD with nightmares and flashbacks." },
    { keyword: "sleep disturbance", severity: "high", context: "Nightmares disrupting sleep 3x per week." },
    { keyword: "hypervigilance", severity: "medium", context: "Observed startle response during session." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [
      "Do not include specific details of the traumatic incident in documentation.",
    ],
    insurancePhrasing: [
      "Trauma-focused therapy session utilizing evidence-based interventions for PTSD.",
    ],
  },
  icdCodes: [
    { code: "F43.10", description: "Post-traumatic stress disorder, unspecified", confidence: "high" },
    { code: "G47.00", description: "Insomnia, unspecified", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "How many nights this week did nightmares occur, and what time of night did they typically happen?", rationale: "Tracking nightmare frequency and timing informs sleep intervention planning." },
    { question: "When a flashback occurred during the week, were you able to use the grounding technique before or only after the episode peaked?", rationale: "Understanding timing of coping skill activation helps calibrate future skill-building." },
    { question: "Are there specific locations or times of day where hypervigilance feels most intense?", rationale: "Identifying high-trigger environments supports exposure hierarchy development." },
  ],
};

const approvedSarahYesterday: ApprovedCaseNote = {
  visitId: "visit_demo_sarah_yesterday",
  patientName: "Sarah Mitchell",
  isDraft: false,
  approvedAtIso: new Date(Date.now() - 86400000).toISOString(),
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Sarah, I understand you called the crisis line last night. Can you tell me what happened?\nClient: I just felt so overwhelmed. Everything piled up — the bills, the kids, my ex showing up unannounced. I didn't want to hurt myself, but I just didn't know what to do.\nClinician: I'm glad you reached out. That took real courage. Are you having any thoughts of self-harm right now?\nClient: No, not right now. Talking to the counselor last night helped. I just need a plan for when things get that bad again.\nClinician: Absolutely. Let's work on a safety plan together today.",
  narrativeSummary:
    "Client presented for an urgent session following contact with crisis line the previous evening. Client reports feeling overwhelmed by financial stressors, childcare responsibilities, and unexpected contact from ex-partner. Client explicitly denies current suicidal ideation or self-harm intent. Session focused on developing a comprehensive safety plan and identifying crisis triggers.",
  soap: {
    subjective:
      "Client reports calling crisis line previous evening due to feeling overwhelmed. Identifies financial stress, childcare demands, and ex-partner contact as precipitating factors. Denies current suicidal ideation or intent to self-harm. States crisis line contact was helpful.",
    objective:
      "Client appeared emotionally drained but cooperative. Affect tearful at times, congruent with content. Alert and oriented x4. Speech normal. Denies access to means. Engaged actively in safety planning process.",
    assessment:
      "Adjustment disorder with mixed disturbance of emotions and conduct (F43.25). Acute stressor response with appropriate help-seeking behavior. Risk level moderate — client demonstrated protective factors including crisis line utilization and therapy engagement. Safety plan developed.",
    plan:
      "1. Complete safety plan with identified coping strategies and emergency contacts.\n2. Increase session frequency to twice weekly for next 2 weeks.\n3. Refer to financial counseling services.\n4. Coordinate with case manager regarding ex-partner safety concerns.\n5. Follow-up phone check-in tomorrow.",
  },
  psychosocial: {
    crisisReason: {
      value: "Acute overwhelm from cumulative stressors — financial, parenting, and interpersonal conflict.",
      confidence: "high",
    },
    substanceUse: {
      value: "Client denies substance use.",
      confidence: "medium",
    },
    longevityOfIssues: {
      value: "Financial and co-parenting stressors ongoing for approximately 6 months since separation.",
      confidence: "high",
    },
    aggressionHistory: {
      value: "No self-directed or other-directed aggression history. Ex-partner contact raises safety considerations.",
      confidence: "medium",
    },
    supportSystems: {
      value: "Client has a close friend and a sister who provide emotional support. Connected with crisis services.",
      confidence: "high",
    },
    pastInterventions: {
      value: "Client has been in therapy for 3 months. First crisis line utilization.",
      confidence: "high",
    },
  },
  stressFlags: [
    { keyword: "crisis contact", severity: "high", context: "Client called crisis line previous evening." },
    { keyword: "safety plan", severity: "high", context: "Safety plan developed during session." },
    { keyword: "domestic concern", severity: "medium", context: "Ex-partner showing up unannounced." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [
      "Do not document specific financial details or amounts.",
      "Limit documentation of ex-partner details to clinically relevant safety information.",
    ],
    insurancePhrasing: [
      "Crisis intervention session with safety planning for adjustment disorder.",
    ],
  },
  icdCodes: [
    { code: "F43.25", description: "Adjustment disorder with mixed disturbance of emotions and conduct", confidence: "high" },
    { code: "Z63.5", description: "Disruption of family by separation and divorce", confidence: "high" },
    { code: "Z59.9", description: "Problem related to housing and economic circumstances, unspecified", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "Since developing the safety plan, have you identified which coping strategy felt most accessible during a moment of overwhelm?", rationale: "Evaluating safety plan effectiveness ensures it is actionable in future crises." },
    { question: "Has your ex-partner made any additional unannounced contact since our last session?", rationale: "Monitoring safety threat is essential given the interpersonal stressor documented at crisis intake." },
  ],
};

const approvedDavidYesterday: ApprovedCaseNote = {
  visitId: "visit_demo_david_yesterday",
  patientName: "David Okafor",
  isDraft: false,
  approvedAtIso: new Date(Date.now() - 86400000).toISOString(),
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: David, good to see you. How has the new medication been working for you?\nClient: I think it's helping. My mood has been more stable. I'm not having those big dips like before.\nClinician: That's encouraging. Any side effects?\nClient: A little nausea in the morning for the first few days, but that went away. I'm sleeping better too.\nClinician: Great. And how about the therapy homework — the thought record?\nClient: I did it most days. I noticed my negative thoughts usually come up around work situations.\nClinician: That's a really good insight. Let's explore that pattern today.",
  narrativeSummary:
    "Client presented for a medication follow-up and therapy session. Client reports improved mood stability since starting new medication with minimal initial side effects (nausea, resolved). Sleep has improved. Client completed thought records and identified work-related situations as primary triggers for negative thinking patterns. Session focused on cognitive restructuring around work-related automatic thoughts.",
  soap: {
    subjective:
      "Client reports improved mood stability on current medication. Initial nausea resolved within first few days. Reports improved sleep. Completed thought record homework and identified work situations as primary trigger for negative thinking patterns.",
    objective:
      "Client appeared well-groomed and engaged. Affect was brighter than previous sessions, mood described as 'more stable.' Alert and oriented x4. Speech normal rate and volume. Thought process logical and goal-directed. Brought completed thought records to session.",
    assessment:
      "Major depressive disorder, recurrent, moderate (F33.1), showing treatment response. Medication adjustment appears effective with improved mood and sleep. Cognitive behavioral therapy is progressing well — client demonstrating insight into thought patterns. Risk level low.",
    plan:
      "1. Continue current medication regimen.\n2. Continue weekly CBT sessions.\n3. Focus next session on cognitive restructuring techniques for work-related thoughts.\n4. Assign behavioral activation exercise for pleasant activities.\n5. Medication management follow-up with psychiatrist in 4 weeks.",
  },
  psychosocial: {
    crisisReason: {
      value: "Recurrent depression managed with medication and therapy; no acute crisis.",
      confidence: "high",
    },
    substanceUse: {
      value: "No substance use reported. No concerns noted.",
      confidence: "medium",
    },
    longevityOfIssues: {
      value: "Depressive episodes recurring over 3 years. Current treatment initiated 6 weeks ago.",
      confidence: "high",
    },
    aggressionHistory: {
      value: "No aggression history.",
      confidence: "medium",
    },
    supportSystems: {
      value: "Client has supportive wife and is active in church community.",
      confidence: "high",
    },
    pastInterventions: {
      value: "Previous trial of SSRI with partial response. Current regimen is second medication trial. Engaged in CBT for 6 weeks.",
      confidence: "high",
    },
  },
  stressFlags: [
    { keyword: "depression", severity: "medium", context: "Recurrent depression, currently improving with treatment." },
    { keyword: "work stress", severity: "low", context: "Work situations identified as cognitive trigger." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: [
      "Medication management follow-up and CBT session for recurrent major depressive disorder.",
    ],
  },
  icdCodes: [
    { code: "F33.1", description: "Major depressive disorder, recurrent, moderate", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Which specific work situations triggered the most negative automatic thoughts this week, and what were the thoughts?", rationale: "Identifying specific cognitive triggers enables targeted restructuring in the next session." },
    { question: "Have you been able to complete the behavioral activation exercise, and how did it affect your mood?", rationale: "Monitoring homework completion and mood response tracks treatment progress." },
  ],
};

// --- Jennifer Simpson additional sessions (PTSD arc) ---

const approvedJenniferFeb18: ApprovedCaseNote = {
  visitId: "visit_demo_jennifer_feb18",
  patientName: "Jennifer Simpson",
  isDraft: false,
  approvedAtIso: "2026-02-18T14:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Jennifer, how have you been since we last spoke?\nClient: Really bad. The nightmares are almost every night now — five or six times a week. I'm exhausted and I can't function at work.\nClinician: Are you having any thoughts of hurting yourself?\nClient: No, nothing like that. But I feel like I'm losing my mind.\nClinician: Let's talk about what's been triggering the nightmares and review our safety plan.",
  narrativeSummary:
    "Client reports significant increase in nightmare frequency (5–6x/week), severely impacting sleep and occupational functioning. Client denies suicidal ideation. Session focused on trigger identification and safety planning. PTSD symptom burden remains high.",
  soap: {
    subjective:
      "Client reports nightmares 5–6 nights per week. States she is exhausted and struggling to function at work. Denies SI/HI. Describes feeling 'like I'm losing my mind.'",
    objective:
      "Client appeared significantly fatigued. Affect flat, congruent with content. Alert and oriented x4. Hypervigilance noted. No psychomotor abnormalities.",
    assessment:
      "PTSD (F43.10) with severe re-experiencing symptoms. Nightmare frequency increased from baseline. Occupational impairment present. Risk level moderate.",
    plan:
      "1. Introduce imagery rehearsal therapy for nightmares.\n2. Review and update safety plan.\n3. Consider referral for medication evaluation.\n4. Continue weekly sessions.",
  },
  psychosocial: {
    crisisReason: { value: "PTSD nightmares 5–6x/week severely impacting sleep and work.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "PTSD symptoms ongoing ~6 months.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Partner supportive; peer support group biweekly.", confidence: "high" },
    pastInterventions: { value: "Individual therapy 2 months. SSRI trial with partial response.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "PTSD", severity: "high", context: "Active PTSD with nightmares 5–6x/week." },
    { keyword: "sleep disturbance", severity: "high", context: "Severe sleep disruption impacting work." },
    { keyword: "occupational impairment", severity: "high", context: "Unable to function at work due to fatigue." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: ["Do not document specific trauma incident details."],
    insurancePhrasing: ["Trauma-focused therapy for PTSD with severe re-experiencing symptoms."],
  },
  icdCodes: [
    { code: "F43.10", description: "Post-traumatic stress disorder, unspecified", confidence: "high" },
    { code: "G47.00", description: "Insomnia, unspecified", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Has nightmare content changed or intensified recently?", rationale: "Tracking nightmare themes informs imagery rehearsal therapy planning." },
    { question: "Has work attendance been affected this week?", rationale: "Occupational functioning is an insurance-relevant outcome metric." },
  ],
};

const approvedJenniferFeb25: ApprovedCaseNote = {
  visitId: "visit_demo_jennifer_feb25",
  patientName: "Jennifer Simpson",
  isDraft: false,
  approvedAtIso: "2026-02-25T14:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: How were the nightmares this week?\nClient: Still bad, but maybe a little better? Down to three or four nights instead of every night.\nClinician: That's a meaningful change. Did you try the imagery rehearsal exercise?\nClient: I did, twice. It felt strange but I think it helped one of those nights.\nClinician: That's encouraging progress. Let's keep building on that.",
  narrativeSummary:
    "Client reports modest improvement in nightmare frequency (3–4x/week vs. 5–6x previously). Client has attempted imagery rehearsal therapy twice with some perceived benefit. Session reinforced skill use and continued CPT work.",
  soap: {
    subjective:
      "Client reports nightmares reduced to 3–4 nights this week. Completed imagery rehearsal twice. Reports one night of improved sleep following exercise.",
    objective:
      "Client appeared less fatigued than prior session. Affect slightly brighter. Engaged in session. Brought notes from imagery rehearsal attempt.",
    assessment:
      "PTSD (F43.10) with gradual treatment response. Nightmare frequency decreasing. Imagery rehearsal technique being integrated. Risk level moderate.",
    plan:
      "1. Continue imagery rehearsal nightly.\n2. Introduce cognitive processing therapy worksheet.\n3. Maintain weekly sessions.\n4. Follow up on medication referral status.",
  },
  psychosocial: {
    crisisReason: { value: "PTSD with ongoing nightmares, gradual improvement.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "PTSD symptoms ~7 months.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Partner and peer group remain supportive.", confidence: "high" },
    pastInterventions: { value: "3 months individual therapy. Imagery rehearsal initiated.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "PTSD", severity: "high", context: "Active PTSD, nightmares 3–4x/week." },
    { keyword: "sleep disturbance", severity: "medium", context: "Improving but sleep still disrupted." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Trauma-focused CBT with imagery rehearsal for PTSD; gradual symptom improvement noted."],
  },
  icdCodes: [
    { code: "F43.10", description: "Post-traumatic stress disorder, unspecified", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "How many nights this week did you complete the imagery rehearsal exercise?", rationale: "Homework adherence predicts treatment response in imagery rehearsal therapy." },
  ],
};

const draftJenniferMar3: FullCaseNote = {
  visitId: "visit_demo_jennifer_mar3",
  patientName: "Jennifer Simpson",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: "2026-03-03T10:00:00.000Z",
  transcript:
    "Clinician: How was your week?\nClient: Actually, better. Only two nights with nightmares. And I used the grounding technique before bed — I think it helped.\nClinician: That's real progress, Jennifer. How did work go?\nClient: I made it in every day this week. First time in a while.\nClinician: That's significant. Let's talk about what you did differently.",
  narrativeSummary:
    "Client reports significant improvement — nightmares reduced to 2 nights per week, successfully using pre-sleep grounding, and returned to full work attendance. First week of full occupational functioning since PTSD onset. Session reinforced gains and introduced relapse prevention planning.",
  soap: {
    subjective:
      "Client reports nightmares only 2 nights this week. Using grounding technique before bed with success. Reports full work attendance for first time since onset. Mood improved.",
    objective:
      "Client appeared well-rested and engaged. Affect brighter, mood elevated. Smiled when discussing work attendance. Alert and oriented x4.",
    assessment:
      "PTSD (F43.10) with significant treatment response. Nightmare frequency at new low. Occupational functioning restored. Risk level low-moderate.",
    plan:
      "1. Introduce relapse prevention planning.\n2. Continue imagery rehearsal and grounding.\n3. Discuss step-down to biweekly sessions.\n4. PCL-5 reassessment next session.",
  },
  psychosocial: {
    crisisReason: { value: "PTSD with improving symptoms; focus shifting to maintenance.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "PTSD ~8 months, significant improvement over 3 weeks.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Partner and peer group remain supportive.", confidence: "high" },
    pastInterventions: { value: "4 months therapy, imagery rehearsal, grounding techniques.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "PTSD", severity: "medium", context: "PTSD improving, nightmares 2x/week." },
    { keyword: "sleep disturbance", severity: "low", context: "Sleep significantly improved from baseline." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Ongoing trauma-focused therapy demonstrating significant functional improvement."],
  },
  icdCodes: [
    { code: "F43.10", description: "Post-traumatic stress disorder, unspecified", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "What do you think made the biggest difference in your progress this week?", rationale: "Identifying effective coping strategies supports relapse prevention planning." },
  ],
};

// --- David Okafor additional sessions (depression improving arc) ---

const approvedDavidFeb21: ApprovedCaseNote = {
  visitId: "visit_demo_david_feb21",
  patientName: "David Okafor",
  isDraft: false,
  approvedAtIso: "2026-02-21T11:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: David, you started the new medication two weeks ago. How are you feeling?\nClient: Honestly, not much change yet. I'm still having the low moods, especially in the mornings.\nClinician: That's expected — it can take 4 to 6 weeks for full effect. How's your sleep?\nClient: A bit better, actually. I'm sleeping through the night more often.\nClinician: That's a positive sign. Let's start the thought records today.",
  narrativeSummary:
    "Client 2 weeks into new antidepressant medication. Reports minimal mood improvement but improved sleep as early positive indicator. Session introduced thought records as CBT homework. Clinician normalized medication timeline.",
  soap: {
    subjective:
      "Client reports minimal mood improvement 2 weeks post-medication initiation. Describes persistent morning low moods. Notes improved sleep quality. No side effects reported.",
    objective:
      "Client appeared subdued but cooperative. Affect flat, mood low. Alert and oriented x4. Engaged with introduction of thought records.",
    assessment:
      "Major depressive disorder, recurrent, moderate (F33.1). Early medication trial; improved sleep suggests partial response. CBT being initiated alongside pharmacotherapy.",
    plan:
      "1. Continue medication as prescribed. Reassess at 4-week mark.\n2. Begin thought records — assign worksheet.\n3. Schedule next session in one week.\n4. Monitor for side effects.",
  },
  psychosocial: {
    crisisReason: { value: "Recurrent depression, early treatment phase.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "Depressive episodes over 3 years. Current episode ~8 weeks.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Wife supportive. Active in church community.", confidence: "high" },
    pastInterventions: { value: "Prior SSRI trial, partial response. CBT initiated this week.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "depression", severity: "medium", context: "Recurrent MDD, early medication trial." },
    { keyword: "low mood", severity: "medium", context: "Morning low moods persist despite treatment start." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Medication management follow-up and CBT initiation for recurrent MDD."],
  },
  icdCodes: [
    { code: "F33.1", description: "Major depressive disorder, recurrent, moderate", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Are you noticing any changes in energy or motivation even if mood hasn't lifted yet?", rationale: "Energy often precedes mood improvement and signals early medication response." },
  ],
};

const approvedDavidFeb28: ApprovedCaseNote = {
  visitId: "visit_demo_david_feb28",
  patientName: "David Okafor",
  isDraft: false,
  approvedAtIso: "2026-02-28T11:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: David, we're at the 3-week mark. How are you feeling now?\nClient: Definitely better than two weeks ago. The morning lows are shorter. I even went for a walk this week, which I haven't done in months.\nClinician: That's great behavioral activation. How did the thought records go?\nClient: I filled out four. I could see that a lot of my negative thoughts were about not being good enough at work.\nClinician: That's excellent insight. Let's challenge some of those thoughts today.",
  narrativeSummary:
    "Client reports meaningful mood improvement at 3 weeks on new antidepressant. Morning depressive episodes shorter in duration. Client spontaneously engaged in behavioral activation (walking). Completed thought records with key insight into work-related negative cognitions. Session focused on cognitive restructuring.",
  soap: {
    subjective:
      "Client reports improvement in morning mood episodes — shorter duration and less intensity. Completed 4 thought records and identified work performance as primary cognitive theme. Walked outside for first time in months.",
    objective:
      "Client appeared more engaged than prior sessions. Affect warmer, mood described as 'better.' Brought completed thought records. Alert and oriented x4.",
    assessment:
      "MDD recurrent moderate (F33.1) showing treatment response. Medication beginning to take effect. CBT progressing with client demonstrating cognitive awareness. Risk level low.",
    plan:
      "1. Continue medication. Psychiatry follow-up in 2 weeks.\n2. Assign cognitive restructuring worksheet.\n3. Continue behavioral activation — increase walking frequency.\n4. Weekly CBT sessions.",
  },
  psychosocial: {
    crisisReason: { value: "Recurrent MDD with improving trajectory.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "Depressive episodes 3 years; current episode improving at week 3 of treatment.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Wife and church community supportive.", confidence: "high" },
    pastInterventions: { value: "3 weeks on new antidepressant. CBT ongoing.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "depression", severity: "medium", context: "MDD improving; morning symptoms reduced." },
    { keyword: "work stress", severity: "low", context: "Work-related negative cognitions identified in thought records." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["CBT and medication management for MDD with documented treatment response."],
  },
  icdCodes: [
    { code: "F33.1", description: "Major depressive disorder, recurrent, moderate", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Have you continued the walking this week, and how has it affected your mood?", rationale: "Behavioral activation outcomes inform CBT planning." },
  ],
};

// --- Sarah Mitchell additional sessions ---

const approvedSarahFeb27: ApprovedCaseNote = {
  visitId: "visit_demo_sarah_feb27",
  patientName: "Sarah Mitchell",
  isDraft: false,
  approvedAtIso: "2026-02-27T16:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: How has this week been, Sarah?\nClient: Hard. My ex called three times even though there's a no-contact order. And the landlord is threatening eviction because I'm two months behind on rent.\nClinician: That's a lot to carry. How are you holding up emotionally?\nClient: I'm managing, barely. I haven't been sleeping well and I snapped at my kids yesterday. I feel terrible about it.\nClinician: Let's talk about what support you have right now.",
  narrativeSummary:
    "Client reports escalating stressors including repeated no-contact order violations by ex-partner and imminent eviction threat. Reports sleep disruption and emotional dysregulation impacting parenting. No crisis contact this week but risk level elevated. Session focused on safety assessment and resource mobilization.",
  soap: {
    subjective:
      "Client reports ex-partner violated no-contact order 3 times this week. Landlord threatening eviction due to 2-month rent arrears. Reports poor sleep and emotional dysregulation resulting in conflict with children. No SI/HI.",
    objective:
      "Client appeared stressed and tearful. Affect labile, congruent with content. Alert and oriented x4. Showed evidence of emotional dysregulation but no acute crisis presentation.",
    assessment:
      "Adjustment disorder (F43.25) with escalating psychosocial stressors. Risk level elevated — cumulative stress approaching crisis threshold. No current SI but protective factors need reinforcement.",
    plan:
      "1. Provide legal aid referral for no-contact order violation.\n2. Connect with emergency rental assistance program.\n3. Review safety plan and update emergency contacts.\n4. Increase session frequency — schedule additional check-in mid-week.\n5. Discuss emotion regulation strategies for parenting situations.",
  },
  psychosocial: {
    crisisReason: { value: "Escalating stressors: legal violation, housing threat, emotional dysregulation.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "Stressors escalating over 7 months post-separation.", confidence: "high" },
    aggressionHistory: { value: "No self-harm. Ex-partner violations raise ongoing safety concern.", confidence: "medium" },
    supportSystems: { value: "Sister and close friend available. Crisis line number on file.", confidence: "high" },
    pastInterventions: { value: "4 months therapy. Safety plan in place.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "safety concern", severity: "high", context: "No-contact order violated 3 times this week." },
    { keyword: "eviction risk", severity: "high", context: "Landlord threatening eviction, 2 months arrears." },
    { keyword: "sleep disturbance", severity: "medium", context: "Sleep disruption contributing to emotional dysregulation." },
  ],
  boundaries: {
    legalStatusOmitted: false,
    overdocumentationWarnings: ["Do not document specific financial amounts or addresses."],
    insurancePhrasing: ["Crisis-adjacent session with safety planning and resource coordination for adjustment disorder."],
  },
  icdCodes: [
    { code: "F43.25", description: "Adjustment disorder with mixed disturbance of emotions and conduct", confidence: "high" },
    { code: "Z63.5", description: "Disruption of family by separation and divorce", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Have you documented or reported the no-contact order violations to authorities?", rationale: "Legal documentation of violations is critical for client safety and case continuity." },
    { question: "Were you able to contact the rental assistance program before this session?", rationale: "Tracking resource access informs ongoing case management." },
  ],
};

const draftSarahMar5: FullCaseNote = {
  visitId: "visit_demo_sarah_mar5",
  patientName: "Sarah Mitchell",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: new Date().toISOString(),
  transcript:
    "Clinician: Sarah, I'm glad you came in today. How are you feeling after everything that happened?\nClient: Better than Monday, honestly. Calling the crisis line helped me reset. I'm still scared but I feel like I have a plan now.\nClinician: That took real strength. Let's review the safety plan and see how it's holding up.\nClient: I've been using the coping cards. My sister came to stay with me for a few days, which helped a lot.\nClinician: That's exactly the kind of support system we want to activate.",
  narrativeSummary:
    "Client presents for post-crisis follow-up session following crisis line contact on March 4. Reports improved affect and sense of agency following crisis intervention. Sister providing in-home support. Client actively utilizing safety plan tools including coping cards. Session reinforced protective factors and reviewed updated safety plan.",
  soap: {
    subjective:
      "Client reports improved mood and decreased crisis-level distress following Monday's crisis line contact. Sister staying with her for support. Using coping cards from safety plan. Denies current SI. Reports still feeling 'scared but stable.'",
    objective:
      "Client appeared less distressed than at crisis visit. Affect anxious but brighter. Alert and oriented x4. Engaged constructively in safety plan review.",
    assessment:
      "Adjustment disorder (F43.25). Post-crisis stabilization with appropriate help-seeking and utilization of support systems. Protective factors actively engaged. Risk level decreased to moderate.",
    plan:
      "1. Continue twice-weekly sessions for next 2 weeks.\n2. Update safety plan with sister as primary support contact.\n3. Follow up on legal aid and rental assistance referrals.\n4. Introduce emotion regulation skills from DBT framework.\n5. Monitor closely given ongoing environmental stressors.",
  },
  psychosocial: {
    crisisReason: { value: "Post-crisis stabilization; acute distress resolved, ongoing stressors present.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "Cumulative stressors over 7 months; acute crisis episode Mar 4.", confidence: "high" },
    aggressionHistory: { value: "No self-harm. Ex-partner safety concern ongoing.", confidence: "medium" },
    supportSystems: { value: "Sister staying in home. Crisis line and therapy as support.", confidence: "high" },
    pastInterventions: { value: "5 months therapy. Safety plan utilized successfully.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "post-crisis", severity: "medium", context: "Following crisis contact; stabilizing with support." },
    { keyword: "ongoing safety concern", severity: "medium", context: "Environmental stressors (housing, ex-partner) persist." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Post-crisis stabilization session with safety planning review for adjustment disorder."],
  },
  icdCodes: [
    { code: "F43.25", description: "Adjustment disorder with mixed disturbance of emotions and conduct", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "How long is your sister able to stay, and do you have a plan for after she leaves?", rationale: "Transition planning after removal of acute support is critical for relapse prevention." },
    { question: "Have the legal aid and rental assistance referrals been contacted?", rationale: "Reducing environmental stressors is central to maintaining stabilization." },
  ],
};

// --- Jonny Clarkson additional session ---

const approvedJonnyFeb28: ApprovedCaseNote = {
  visitId: "visit_demo_jonny_feb28",
  patientName: "Jonny Clarkson",
  isDraft: false,
  approvedAtIso: "2026-02-28T09:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Jonny, any updates on the housing application?\nClient: Yeah, actually I got a call. I'm on the waitlist now — number 14. They said it could be 3 to 6 weeks.\nClinician: That's real progress. How are you feeling about that?\nClient: Relieved, kind of. But also anxious about the waiting. I got a temp job at a warehouse this week though.\nClinician: Getting employment is a huge step. Let's talk about how to stabilize things while you wait for housing.",
  narrativeSummary:
    "Client reports significant progress: placed on housing waitlist (#14, estimated 3–6 weeks) and obtained temporary employment. Anxiety about housing timeline present but affect improved. Session focused on stabilization strategies and employment maintenance during waitlist period.",
  soap: {
    subjective:
      "Client placed on housing waitlist (#14). Reports 3–6 week estimated wait. Started temp warehouse job this week. Describes relief mixed with anxiety about waiting period.",
    objective:
      "Client appeared more hopeful than intake session. Affect anxious but with moments of positive anticipation. Alert and oriented x4. Speech less pressured.",
    assessment:
      "Adjustment disorder (F43.23) with improving trajectory. Housing waitlist placement and employment represent significant stabilizing factors. Anxiety about uncertainty remains. Risk level low.",
    plan:
      "1. Continue weekly sessions.\n2. Develop plan for employment maintenance during housing transition.\n3. Identify backup housing if waitlist extends.\n4. Screen for depression with PHQ-9 next session.",
  },
  psychosocial: {
    crisisReason: { value: "Housing instability ongoing but waitlist placement achieved.", confidence: "high" },
    substanceUse: { value: "No concerns noted.", confidence: "medium" },
    longevityOfIssues: { value: "Housing instability ~3 months. Employment gap also ~3 months.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Friends providing temporary housing. Employer contact established.", confidence: "medium" },
    pastInterventions: { value: "2 intake sessions. Referred to case management and housing programs.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "housing instability", severity: "medium", context: "On waitlist; still not housed but progress made." },
    { keyword: "anxiety", severity: "medium", context: "Anxiety about housing timeline despite positive developments." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Psychotherapy for adjustment disorder with positive response to case management interventions."],
  },
  icdCodes: [
    { code: "F43.23", description: "Adjustment disorder with mixed anxiety and depressed mood", confidence: "high" },
    { code: "Z59.0", description: "Homelessness", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "Has the housing agency confirmed whether timeline can be tracked online or by phone?", rationale: "Access to waitlist status updates reduces uncertainty and anxiety." },
  ],
};

// --- Marcus Webb (new patient — substance use recovery) ---

const approvedMarcusFeb15: ApprovedCaseNote = {
  visitId: "visit_demo_marcus_feb15",
  patientName: "Marcus Webb",
  isDraft: false,
  approvedAtIso: "2026-02-15T10:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Marcus, this is your first session with me. What brings you in today?\nClient: My family basically gave me an ultimatum. Either I get help for the drinking or they're done. I don't want to lose my family.\nClinician: That takes courage to hear and act on. How much have you been drinking?\nClient: A bottle of whiskey a day, sometimes more. I've been doing this for two years.\nClinician: Are you experiencing any withdrawal symptoms when you go without?\nClient: Shaking, sweating. A few times I've seen things that weren't there.",
  narrativeSummary:
    "Client presented for intake following family ultimatum regarding alcohol use. Reports daily consumption of approximately one bottle of whiskey with 2-year history. Reports withdrawal symptoms including tremors, diaphoresis, and possible hallucinations suggesting severe alcohol use disorder. Urgent safety assessment conducted. Referral to medically supervised detox discussed.",
  soap: {
    subjective:
      "Client reports drinking ~1 bottle of whiskey/day for 2 years. Family ultimatum precipitated treatment-seeking. Reports withdrawal symptoms: tremors, diaphoresis, and possible visual hallucinations. Denies SI. Motivated to change to preserve family.",
    objective:
      "Client appeared anxious and slightly tremulous. Affect congruent with reported distress. Alert and oriented x4. No acute intoxication observed.",
    assessment:
      "Severe alcohol use disorder (F10.20) with withdrawal symptoms suggesting physical dependence. Risk level high — withdrawal hallucinations indicate need for medically supervised detox. Motivated for change.",
    plan:
      "1. Urgent referral for medically supervised detox evaluation.\n2. Provide withdrawal safety information and emergency contacts.\n3. Schedule follow-up within 48 hours.\n4. Engage family in treatment planning with consent.\n5. Assess for co-occurring depression/anxiety at next visit.",
  },
  psychosocial: {
    crisisReason: { value: "Severe alcohol use disorder with active withdrawal symptoms, family crisis.", confidence: "high" },
    substanceUse: { value: "~1 bottle whiskey/day for 2 years. Active physical withdrawal symptoms.", confidence: "high" },
    longevityOfIssues: { value: "Problematic drinking escalating over 2 years.", confidence: "high" },
    aggressionHistory: { value: "No aggression reported; family conflict context present.", confidence: "medium" },
    supportSystems: { value: "Family still present and willing to engage in treatment. Motivated by family preservation.", confidence: "high" },
    pastInterventions: { value: "No prior treatment. First help-seeking attempt.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "substance use", severity: "high", context: "Daily heavy alcohol use with physical withdrawal symptoms." },
    { keyword: "withdrawal risk", severity: "high", context: "Hallucinations during withdrawal indicate severe dependence." },
    { keyword: "family crisis", severity: "high", context: "Family ultimatum driving treatment engagement." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: ["Do not document specific family member names or contact information."],
    insurancePhrasing: ["Intake for severe alcohol use disorder with urgent detox referral indicated."],
  },
  icdCodes: [
    { code: "F10.20", description: "Alcohol use disorder, severe, uncomplicated", confidence: "high" },
    { code: "F10.232", description: "Alcohol dependence with withdrawal with perceptual disturbance", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "Were you able to contact the detox facility, and are you willing to pursue inpatient detox?", rationale: "Withdrawal with hallucinations requires medical supervision to prevent seizure risk." },
    { question: "Has your family been informed about the severity of withdrawal risks and the detox recommendation?", rationale: "Family education and involvement is critical for treatment motivation and safety planning." },
  ],
};

const approvedMarcusFeb25: ApprovedCaseNote = {
  visitId: "visit_demo_marcus_feb25",
  patientName: "Marcus Webb",
  isDraft: false,
  approvedAtIso: "2026-02-25T10:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Marcus, you completed detox. How are you feeling?\nClient: Like a different person. I'm 10 days sober. I forgot what it felt like to wake up without shaking.\nClinician: Ten days is a real achievement. How is your family responding?\nClient: My wife is cautiously optimistic. We're talking more. My kids are happy to have me back.\nClinician: That's meaningful. Tell me about your urges this week.",
  narrativeSummary:
    "Client successfully completed medically supervised detox and is 10 days sober. Reports improved physical wellbeing and improved family relationships. Urges to drink present but manageable with coping strategies introduced in detox. Session introduced relapse prevention framework and AA referral discussed.",
  soap: {
    subjective:
      "Client reports 10 days sobriety following successful inpatient detox. Improved physical symptoms. Wife described as 'cautiously optimistic.' Children responding positively. Reports urges present but manageable.",
    objective:
      "Client appeared physically healthier — no tremor, clear-eyed. Affect brighter, mood elevated. Alert and oriented x4. Engaged and motivated.",
    assessment:
      "Alcohol use disorder, severe, in early remission (F10.20). Successful detox completion. Early recovery phase with appropriate motivation. Family relationship improvement noted. Risk level moderate — early recovery is high-relapse period.",
    plan:
      "1. Refer to AA or SMART Recovery group.\n2. Continue weekly individual sessions focused on relapse prevention.\n3. Introduce urge surfing technique.\n4. Family session to reinforce supportive dynamics.\n5. 30-day sobriety marker — acknowledge at next session.",
  },
  psychosocial: {
    crisisReason: { value: "Early recovery from severe AUD; relapse risk period.", confidence: "high" },
    substanceUse: { value: "10 days sober post-detox. Urges present but managed.", confidence: "high" },
    longevityOfIssues: { value: "2-year AUD; 10 days in recovery.", confidence: "high" },
    aggressionHistory: { value: "No aggression reported.", confidence: "medium" },
    supportSystems: { value: "Wife and children re-engaged. Detox peer community as additional support.", confidence: "high" },
    pastInterventions: { value: "Completed medically supervised inpatient detox. Now in outpatient phase.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "substance use", severity: "high", context: "Early recovery; high relapse risk period." },
    { keyword: "urges", severity: "medium", context: "Urges to drink present but currently managed." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Early recovery session for severe AUD; relapse prevention and peer support referral."],
  },
  icdCodes: [
    { code: "F10.20", description: "Alcohol use disorder, severe, uncomplicated", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "What situations triggered the strongest urges this week, and how did you manage them?", rationale: "Identifying high-risk situations informs individualized relapse prevention plan." },
    { question: "Have you attended any AA or SMART Recovery meetings yet?", rationale: "Peer support engagement strongly predicts sustained recovery outcomes." },
  ],
};

const draftMarcusMar3: FullCaseNote = {
  visitId: "visit_demo_marcus_mar3",
  patientName: "Marcus Webb",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: "2026-03-03T14:00:00.000Z",
  transcript:
    "Clinician: Marcus, you've hit 30 days. How does that feel?\nClient: Amazing. I didn't think I could do it. I've been going to AA three times a week — I have a sponsor now.\nClinician: That's a huge milestone. Any close calls this week?\nClient: At a work event there was an open bar. I had a moment where I really wanted a drink, but I called my sponsor and he talked me through it.\nClinician: That's the program working exactly as it should.",
  narrativeSummary:
    "Client reached 30-day sobriety milestone. Actively engaged with AA (3x/week) and has established sponsor relationship. Successfully navigated high-risk social situation (open bar event) using sponsor support. Session celebrated milestone and introduced next phase of recovery planning.",
  soap: {
    subjective:
      "Client reports 30 days sobriety. Attending AA 3 times per week. Has a sponsor. Successfully used sponsor call to manage urge at work event with open bar. Reports improved mood, energy, and family relationships.",
    objective:
      "Client appeared confident and engaged. Affect warm and positive. Alert and oriented x4. No signs of use. Demonstrated insight into relapse triggers and protective coping.",
    assessment:
      "Alcohol use disorder, severe, in sustained early remission (F10.20). Exceptional progress at 30 days. Strong recovery support network. Effective coping demonstrated under real-world pressure. Risk level decreasing.",
    plan:
      "1. Continue AA attendance; reinforce sponsor relationship.\n2. Discuss 60-day goals and long-term recovery planning.\n3. Step down to biweekly sessions pending continued progress.\n4. Family therapy check-in at next session.",
  },
  psychosocial: {
    crisisReason: { value: "AUD in early recovery; focus shifting to long-term maintenance.", confidence: "high" },
    substanceUse: { value: "30 days sober. No relapse. Urges managed with sponsor support.", confidence: "high" },
    longevityOfIssues: { value: "2-year AUD. 30 days in recovery.", confidence: "high" },
    aggressionHistory: { value: "No aggression history.", confidence: "medium" },
    supportSystems: { value: "Wife and children supportive. AA sponsor and group as primary recovery network.", confidence: "high" },
    pastInterventions: { value: "Inpatient detox. 3 weeks outpatient therapy. AA with sponsor.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "substance use", severity: "medium", context: "30 days sober; urges present but well-managed." },
    { keyword: "relapse risk", severity: "low", context: "High-risk situation (open bar) navigated successfully." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Ongoing AUD recovery session; 30-day milestone with strong peer support engagement."],
  },
  icdCodes: [
    { code: "F10.20", description: "Alcohol use disorder, severe, uncomplicated", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "What are your goals for the next 30 days in your recovery?", rationale: "Forward-looking goal-setting reinforces motivation and structures recovery planning." },
  ],
};

// --- Priya Nair (new patient — grief and isolation) ---

const approvedPriyaFeb24: ApprovedCaseNote = {
  visitId: "visit_demo_priya_feb24",
  patientName: "Priya Nair",
  isDraft: false,
  approvedAtIso: "2026-02-24T13:00:00.000Z",
  approvedBy: "Dr. Maria Chen",
  transcript:
    "Clinician: Priya, tell me what's been going on.\nClient: My mother died three months ago. She was my best friend. I thought I'd be okay by now but I'm not eating, I'm not sleeping, I'm not leaving the apartment.\nClinician: That's profound loss. Grief doesn't follow a timeline. How long have you been isolating?\nClient: Since the funeral, mostly. I just can't face people.\nClinician: Are you having any thoughts of not wanting to be here?\nClient: Sometimes. Nothing specific, but I think about how much easier it would be if I wasn't here.",
  narrativeSummary:
    "Client presents with complicated grief following loss of mother 3 months ago, described as primary attachment figure. Reports significant functional impairment — not eating, not sleeping, complete social isolation. Reports passive suicidal ideation (no plan, no intent). Comprehensive risk assessment conducted. Safety plan established. Diagnosis of prolonged grief disorder with comorbid major depression warranted.",
  soap: {
    subjective:
      "Client reports death of mother 3 months ago. Complete social isolation since funeral. Not eating or sleeping adequately. Reports passive SI — 'easier if I wasn't here' — without plan or intent. Denies access to means.",
    objective:
      "Client appeared significantly distressed, tearful throughout. Affect congruent with content. Appeared under-nourished and fatigued. Alert and oriented x4. Safety plan established and client agreed to terms.",
    assessment:
      "Prolonged grief disorder (F43.81) with comorbid major depressive episode (F32.1). Passive SI present without plan or means. Risk level high given severity of impairment and SI. Safety plan established.",
    plan:
      "1. Safety plan completed — emergency contacts, crisis line, means restriction.\n2. Refer to psychiatry for medication evaluation.\n3. Weekly individual sessions.\n4. Grief-focused therapy (complicated grief treatment).\n5. Nutritional check-in and medical follow-up referral.\n6. Check-in call in 48 hours.",
  },
  psychosocial: {
    crisisReason: { value: "Complicated grief with functional collapse, passive SI, and social isolation.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "Acute onset following mother's death 3 months ago.", confidence: "high" },
    aggressionHistory: { value: "No aggression history. Passive SI present.", confidence: "high" },
    supportSystems: { value: "Isolated from friends and family. Husband works long hours. No current peer support.", confidence: "high" },
    pastInterventions: { value: "No prior mental health treatment.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "suicidal ideation", severity: "high", context: "Passive SI — 'easier if I wasn't here' — no plan." },
    { keyword: "complicated grief", severity: "high", context: "Functional collapse 3 months post-bereavement." },
    { keyword: "social isolation", severity: "high", context: "Complete isolation since mother's funeral." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: ["Do not document specific method thoughts even if passive."],
    insurancePhrasing: ["Intake for complicated grief and comorbid major depression with safety planning."],
  },
  icdCodes: [
    { code: "F43.81", description: "Prolonged grief disorder", confidence: "high" },
    { code: "F32.1", description: "Major depressive disorder, single episode, moderate", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Have any of the passive thoughts become more specific or more frequent since this session?", rationale: "Tracking SI trajectory is critical for ongoing safety management." },
    { question: "Has your husband been informed of the level of distress you are experiencing?", rationale: "Family awareness is a key protective factor when client is at elevated risk." },
  ],
};

const draftPriyaMar2: FullCaseNote = {
  visitId: "visit_demo_priya_mar2",
  patientName: "Priya Nair",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: "2026-03-02T15:00:00.000Z",
  transcript:
    "Clinician: Priya, how have you been since our last session?\nClient: I'm still sad, but I felt a little lighter this week. My husband and I talked — he didn't know how bad it was. He's been home more.\nClinician: That sounds like a meaningful shift. How have the thoughts about not wanting to be here been?\nClient: Less. I still miss her terribly but I haven't had those dark thoughts as much.\nClinician: I'm really glad. Have you been leaving the apartment at all?\nClient: Once — I went to the corner store. It was hard but I did it.",
  narrativeSummary:
    "Client shows early signs of improvement at second session. Passive SI frequency reduced. Husband now informed and providing increased support. Client left apartment for first time since mother's death. Grief remains intense but client demonstrating protective engagement with treatment and support system.",
  soap: {
    subjective:
      "Client reports slight improvement in mood. Passive SI thoughts less frequent this week. Husband informed of distress and now providing more support. Left apartment once (corner store visit). Reports still grieving intensely but feels 'a little lighter.'",
    objective:
      "Client appeared somewhat less distressed than initial session. Tearful but less acutely so. Alert and oriented x4. Affect congruent. Made eye contact throughout.",
    assessment:
      "Prolonged grief disorder (F43.81) with comorbid MDD (F32.1). Early treatment response indicated. Passive SI frequency decreased. Social isolation minimally reduced. Risk level moderate (decreased from high).",
    plan:
      "1. Continue weekly grief-focused therapy.\n2. Behavioral activation — assign one daily walk or brief social contact.\n3. Follow up on psychiatry referral status.\n4. Review safety plan; update with husband as emergency contact.\n5. Track SI trajectory at every session.",
  },
  psychosocial: {
    crisisReason: { value: "Prolonged grief with improving trajectory; SI decreasing.", confidence: "high" },
    substanceUse: { value: "Denies substance use.", confidence: "medium" },
    longevityOfIssues: { value: "Grief onset 3 months ago. Treatment initiated 1 week ago.", confidence: "high" },
    aggressionHistory: { value: "No aggression. Passive SI decreased.", confidence: "high" },
    supportSystems: { value: "Husband now engaged and aware. First treatment-related support activation.", confidence: "high" },
    pastInterventions: { value: "1 prior session. Safety plan established. Psychiatry referral pending.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "grief", severity: "high", context: "Prolonged grief, still severe but beginning to process." },
    { keyword: "suicidal ideation", severity: "medium", context: "Passive SI reduced in frequency this week." },
  ],
  boundaries: {
    legalStatusOmitted: true,
    overdocumentationWarnings: [],
    insurancePhrasing: ["Grief-focused therapy session with monitored SI; early positive treatment response."],
  },
  icdCodes: [
    { code: "F43.81", description: "Prolonged grief disorder", confidence: "high" },
    { code: "F32.1", description: "Major depressive disorder, single episode, moderate", confidence: "high" },
  ],
  followUpQuestions: [
    { question: "Have you been able to eat more regularly this week compared to last?", rationale: "Nutritional status affects mood and medication response in MDD." },
    { question: "Was your husband able to accompany you to the psychiatry referral appointment?", rationale: "Partner involvement in psychiatric evaluation improves treatment adherence." },
  ],
};

// --- Carlos Rivera (new patient — complex trauma intake, high risk) ---

const draftCarlosMar5: FullCaseNote = {
  visitId: "visit_demo_carlos_mar5",
  patientName: "Carlos Rivera",
  isDraft: true,
  draftLabel: "DRAFT — pending clinician review",
  generatedAtIso: new Date().toISOString(),
  transcript:
    "Clinician: Carlos, thank you for coming in. Can you tell me a bit about what's been going on?\nClient: I was referred by the VA. I got back from my third deployment 8 months ago and things just... aren't okay. I'm drinking, I'm not sleeping, I had a fight with my neighbor last week. I could have really hurt him.\nClinician: I appreciate you being honest about that. Are you having any thoughts of hurting yourself or others?\nClient: Not myself. But the anger — I can't always control it. That scares me.\nClinician: Have you had any contact with the legal system related to the anger?\nClient: I was arrested once, about 4 months ago. Charges were dropped but it was close.\nClinician: Let's talk about what support looks like right now.",
  narrativeSummary:
    "Veteran presented for intake via VA referral, 8 months post-deployment from third combat tour. Reports alcohol use, severe sleep disturbance, and uncontrolled anger with recent violent incident. History of one arrest (charges dropped) related to aggression. Denies suicidal ideation but endorses significant difficulty controlling anger toward others. Complex trauma presentation consistent with combat-related PTSD with co-occurring AUD. High-risk intake.",
  soap: {
    subjective:
      "Veteran reports escalating alcohol use, insomnia, and anger dysregulation since third deployment 8 months ago. Recent altercation with neighbor with acknowledged potential for serious harm. History of arrest related to aggression 4 months ago (charges dropped). Denies SI. Endorses HI-equivalent anger loss of control.",
    objective:
      "Client appeared guarded but cooperative. Affect tense, hypervigilant posture noted. Alert and oriented x4. Denied current intoxication. Moderate hand tremor. Engaged with direct clinical manner.",
    assessment:
      "Complex PTSD (F43.12) with probable co-occurring AUD (F10.20) and anger dysregulation. High-risk intake — aggression history, alcohol use, sleep deprivation, and trauma exposure. Risk level high. Mandatory reporting considerations assessed.",
    plan:
      "1. Comprehensive risk assessment — HI protocol.\n2. Coordinate with VA case manager for integrated care.\n3. Refer to VA substance use treatment program.\n4. Safety planning focused on anger de-escalation strategies.\n5. Weekly sessions; schedule within 72 hours.\n6. Assess trauma history at next session with validated tool (PCL-5).",
  },
  psychosocial: {
    crisisReason: { value: "Complex combat trauma with anger dysregulation, AUD, insomnia, and prior aggression incident.", confidence: "high" },
    substanceUse: { value: "Active alcohol use, quantity not specified. Escalating since deployment.", confidence: "high" },
    longevityOfIssues: { value: "Symptoms began approximately 8 months ago post-deployment. Three combat tours total.", confidence: "high" },
    aggressionHistory: { value: "Recent violent incident toward neighbor; one arrest 4 months ago (charges dropped). Endorses anger control difficulty.", confidence: "high" },
    supportSystems: { value: "VA referral indicates some system engagement. Family situation not assessed at intake.", confidence: "insufficient_data" },
    pastInterventions: { value: "No prior mental health treatment. First help-seeking since service.", confidence: "high" },
  },
  stressFlags: [
    { keyword: "aggression risk", severity: "high", context: "Recent violent altercation, prior arrest, anger dysregulation." },
    { keyword: "substance use", severity: "high", context: "Active alcohol use escalating post-deployment." },
    { keyword: "combat trauma", severity: "high", context: "Third deployment, 8 months post-return, no prior treatment." },
  ],
  boundaries: {
    legalStatusOmitted: false,
    overdocumentationWarnings: [
      "Do not document specific details of prior arrest without client consent review.",
      "Mandatory reporting obligations assessed — document assessment decision separately.",
    ],
    insurancePhrasing: ["High-risk intake for complex PTSD and AUD in combat veteran; safety planning initiated."],
  },
  icdCodes: [
    { code: "F43.12", description: "Post-traumatic stress disorder, chronic", confidence: "high" },
    { code: "F10.20", description: "Alcohol use disorder, severe, uncomplicated", confidence: "medium" },
    { code: "F63.81", description: "Intermittent explosive disorder", confidence: "medium" },
  ],
  followUpQuestions: [
    { question: "In the incident with your neighbor, what happened immediately before the anger escalated?", rationale: "Identifying specific triggers is essential for developing an anger de-escalation safety plan." },
    { question: "How many drinks per day on average, and have you noticed any withdrawal symptoms (shaking, sweating) when you go without?", rationale: "Quantifying use and assessing dependence determines whether medically supervised detox is needed." },
    { question: "Does anyone at home — a partner, roommate — know about the anger episodes?", rationale: "Home environment assessment is critical for safety planning around aggression risk." },
  ],
};

const dummyNotes: (FullCaseNote | ApprovedCaseNote)[] = [
  // Lisa Smith
  draftLisaToday,
  draftLisaFeb25,
  // Jennifer Simpson
  approvedJenniferFeb18,
  approvedJenniferFeb25,
  draftJenniferMar3,
  approvedJenniferToday,
  // Jonny Clarkson
  approvedJonnyFeb28,
  draftJonnyToday,
  // Sarah Mitchell
  approvedSarahFeb27,
  approvedSarahYesterday,
  draftSarahMar5,
  // David Okafor
  approvedDavidFeb21,
  approvedDavidFeb28,
  approvedDavidYesterday,
  // Marcus Webb
  approvedMarcusFeb15,
  approvedMarcusFeb25,
  draftMarcusMar3,
  // Priya Nair
  approvedPriyaFeb24,
  draftPriyaMar2,
  // Carlos Rivera
  draftCarlosMar5,
];

const SEED_KEY = "caseNotesSeeded_v3";

export function seedDummyNotes(): void {
  if (typeof window === "undefined") return;
  // Only seed if we haven't for this version; bumping SEED_KEY forces a
  // re-seed so that stale notes missing new fields get overwritten.
  if (localStorage.getItem(SEED_KEY)) return;
  saveNotesBatch(dummyNotes);
  localStorage.setItem(SEED_KEY, "true");
}
