// Draft editorial copy for Chen's review; no private project details.
export const posts = [
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
