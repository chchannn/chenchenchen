type Post = {
  slug: string; category: string; minutes: number; title: string;
  description: string; paragraphs: string[]; publishedMonth?: string;
  publishedLabel?: string;
};

export const posts: Post[] = [
  {
    slug: 'my-first-incident-triage-agent', category: 'ENGINEERING', minutes: 3,
    publishedMonth: '2025-04', publishedLabel: 'April 2025',
    title: 'My first incident triage agent.',
    description: 'From hours to under 30 minutes, with one persistent question: what is the evidence?',
    paragraphs: [
      'In April 2025, I built an engineering incident triage agent using Claude 3 Sonnet. I used it to triage more than a dozen incidents. It was my first experience seeing how much an AI agent could do inside a real engineering investigation.',
      'I watched it navigate large volumes of logs, connect data and artifacts to the logic in the code, and work toward the root cause of an incident. Following those connections was the part that caught my attention. A log entry describes something that happened; understanding why it happened means tracing that observation back through the system. The agent could help make that connection.',
      'It could also be confidently wrong. During investigations, I saw it make up information, hallucinate details, and reach conclusions with only partial evidence. It could assemble a plausible explanation before it had enough support to call that explanation a root cause.',
      'That creates a particular problem during an incident. An explanation that sounds convincing can send the investigation in the wrong direction. The agent could move quickly through the available material, but I still had to question whether its conclusion followed from what it had actually found.',
      'The most useful change was to keep asking it for evidence. Whenever it made a claim, I asked it to show the support for that claim and verify it. I carried that requirement into the prompting: provide evidence, check the connection, and verify the conclusion. This became a repeated part of the investigation.',
      'Asking for evidence made the reasoning easier to inspect. Instead of accepting a root-cause explanation because it sounded coherent, I could examine how the agent connected the logs, the artifacts, and the code. When the support was incomplete, there was a concrete reason to keep investigating.',
      'With that prompting and review, we got a triage bot that was quite accurate in the incidents I worked through. Triage that had taken hours came down to less than 30 minutes. Those were the results I saw across this set of investigations, with me still involved in questioning and verifying the agent\'s claims.',
      'That distinction matters when I think about the result. Faster triage meant reaching an understanding of the incident sooner. The agent was helping with the investigation; identifying the cause still left the engineering work of deciding how to respond.',
      'The experience changed how I thought about model capability. I had watched an agent handle enough context to participate in a difficult investigation, and I had also watched it draw conclusions too early. Both were visible in the same workflow.',
      'What stayed with me was how much better the investigation became when I insisted on support for each claim. I could see the capability in the way the agent navigated the system. I learned to trust a conclusion by checking the evidence it brought back.'
    ]
  },
  {
    slug: 'start-with-the-handoff', category: 'AGENT WORKFLOWS', minutes: 2,
    title: 'Start with the handoff.',
    description: 'Before building an agent, look at where the context gets lost.',
    paragraphs: [
      'A customer tells someone in sales about a problem. Sales summarizes it for product. Product turns it into a request for engineering. By the time someone starts building, the original situation may have disappeared.',
      'Every handoff asks a person to compress what they know into what the next person needs. That compression is useful. It also loses things: the reason a request matters, the workaround a customer already tried, or the constraint that makes an obvious solution impractical.',
      'This is where I would start when considering an agent workflow. Pick one recurring handoff. Follow a real request through it. Write down what each person receives, what they have to look up, and what they pass along.',
      'The resulting map gives the agent a concrete job. It might gather the original evidence, connect a request to an existing decision, or prepare a summary with the unanswered questions still visible. Each of those jobs has an identifiable reader and a moment when the output is useful.',
      'The review step matters just as much. A person should be able to see the source, correct the interpretation, and decide whether the request deserves action. A polished summary without that path can simply move an error faster.',
      'Start small enough to inspect the whole loop. Does the next person spend less time reconstructing the situation? Do fewer important details disappear? Those questions are a useful starting point for deciding whether the agent is helping.'
    ]
  },
  {
    slug: 'what-your-eval-is-really-measuring', category: 'EVALUATION', minutes: 2,
    title: 'What your eval is really measuring.',
    description: 'Every definition of a good answer contains a product decision.',
    paragraphs: [
      'Suppose an agent produces an answer that is factually correct but leaves the user unsure what to do next. Should it pass? What about a helpful recommendation that sounds more certain than its evidence allows?',
      'Those questions force a product team to be specific about the experience it wants to create. Correctness matters, but so do usefulness, grounding, and the cost of a mistake in the particular workflow.',
      'I like to begin with examples people can disagree about. Put a small set of outputs in front of the people who will use or review them. Ask what they would accept, what they would change, and what would stop them from using an answer.',
      'Disagreement is informative. One reviewer may prize brevity while another needs the evidence spelled out. Before turning those judgments into labels, the team needs to decide which reader and which situation the system is serving.',
      'Then separate the dimensions. An answer can be grounded and unhelpful. It can follow the requested format and still miss the point. Keeping these judgments visible makes it easier to identify what changed when a new prompt improves one dimension and damages another.',
      'An evaluation set should evolve as the team learns. Keep the difficult examples, record why the judgment changed, and include cases where the appropriate response is to ask a question or stop. The useful outcome is a clearer shared understanding of what the product should do.'
    ]
  },
  {
    slug: 'memory-needs-an-edit-button', category: 'CONTEXT & MEMORY', minutes: 2,
    title: 'Memory needs an edit button.',
    description: 'Useful agent memory should be easy to inspect, correct, and retire.',
    paragraphs: [
      'An agent remembers that a team prefers short summaries. A month later, the team starts using those summaries for a different audience, one that needs more explanation. The old preference keeps shaping new outputs.',
      'Remembering something creates an ongoing responsibility. The system needs a way to tell whether the information still applies, and people need a way to correct it without repeating themselves in every conversation.',
      'A useful memory has more than a sentence of content. It has a source, a scope, and a reason to remain active. Was this an explicit decision, an observed pattern, or a suggestion? Does it apply to one project or to every future task?',
      'Those distinctions should be visible to the person relying on the system. When an output reflects an old preference, the reader should be able to find that preference and change it. Otherwise debugging the answer becomes a guessing game.',
      'There is also a difference between capture and commitment. A meeting note can preserve a tentative idea without turning it into a standing instruction. Promoting a note into durable guidance deserves a deliberate step, especially when other people will inherit the result.',
      'I would judge a memory system partly by how easily it lets a team forget. Can an outdated decision be retired? Can two conflicting preferences be reconciled? Can a person understand why a piece of context influenced an answer? These are everyday product interactions that determine whether memory remains useful.'
    ]
  }
];
