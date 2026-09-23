(() => {
  const STORAGE_KEY = "speckit-presentation-language";

  const STRINGS = {
    fa: {
      dir: "rtl",
      locale: "fa-IR",
      prev: "قبلی",
      next: "بعدی",
      toggle: "English",
      toggleTitle: "نمایش نسخه انگلیسی",
      hint: "در RTL: ← بعدی · → قبلی · Space بعدی",
      slideLabel: (position, title) => `اسلاید ${position}: ${title}`,
      correct: (explanation) => `درست. ${explanation}`,
      incorrect: (explanation) => `نادرست. گزینه درست برجسته شد. ${explanation}`,
    },
    en: {
      dir: "ltr",
      locale: "en-US",
      prev: "Previous",
      next: "Next",
      toggle: "فارسی",
      toggleTitle: "Show the Persian version",
      hint: "← previous · → next · Space next",
      slideLabel: (position, title) => `Slide ${position}: ${title}`,
      correct: (explanation) => `Correct. ${explanation}`,
      incorrect: (explanation) =>
        `Incorrect. The correct answer is highlighted. ${explanation}`,
    },
  };

  const WORKFLOW_STEPS = {
    fa: [
      { title: "Constitution", command: "/speckit.constitution", detail: "یک‌بار برای پروژه: اصول حاکم در memory/constitution.md نوشته می‌شود." },
      { title: "Specify", command: "/speckit.specify", detail: "WHAT و WHY. branch و spec.md ساخته می‌شود؛ هنوز تکنولوژی انتخاب نکنید." },
      { title: "Clarify", command: "/speckit.clarify", detail: "اختیاری ولی توصیه‌شده قبل از plan. ابهام‌ها را صریح می‌کند." },
      { title: "Plan", command: "/speckit.plan", detail: "HOW: پشته فنی، research، data-model، contracts و quickstart." },
      { title: "Tasks", command: "/speckit.tasks", detail: "کارهای قابل‌اجرا با علامت [P] برای اجرای موازی امن." },
      { title: "Analyze", command: "/speckit.analyze", detail: "اختیاری بعد از tasks: پوشش و تناقض بین آرتیفکت‌ها." },
      { title: "Implement", command: "/speckit.implement", detail: "agent tasks را طبق plan اجرا می‌کند." },
      { title: "Converge", command: "/speckit.converge", detail: "فاصله با spec را می‌سنجد و کار باقی‌مانده را اضافه می‌کند تا Converged." },
    ],
    en: [
      { title: "Constitution", command: "/speckit.constitution", detail: "Once per project: governing principles are written to memory/constitution.md." },
      { title: "Specify", command: "/speckit.specify", detail: "Define WHAT and WHY. Spec Kit creates the branch and spec.md; do not choose technology yet." },
      { title: "Clarify", command: "/speckit.clarify", detail: "Optional but recommended before Plan. It makes underspecified requirements explicit." },
      { title: "Plan", command: "/speckit.plan", detail: "Define HOW: stack, research, data model, contracts, and quickstart validation." },
      { title: "Tasks", command: "/speckit.tasks", detail: "Create executable work items, using [P] to mark parallel-safe tasks." },
      { title: "Analyze", command: "/speckit.analyze", detail: "Optionally check coverage and contradictions across artifacts after Tasks." },
      { title: "Implement", command: "/speckit.implement", detail: "The agent executes the task list according to the approved plan." },
      { title: "Converge", command: "/speckit.converge", detail: "Find gaps against the spec and append remaining work until the report says Converged." },
    ],
  };

  const ARTIFACT_TREE = {
    fa: [
      { label: "my-project/", indent: 0, title: "ریشه پروژه", body: "بعد از specify init، فرمان‌های agent و پوشه‌های tooling اینجا ظاهر می‌شوند." },
      { label: "memory/", indent: 1, title: "memory/", body: "جای اصول پایدار پروژه. constitution یک‌بار نوشته می‌شود و plan باید با آن هم‌تراز باشد." },
      { label: "constitution.md", indent: 2, title: "constitution.md", body: "نه ماده حاکم. مواد IV تا VI را تیم شما تعریف می‌کند. مسیر کامل: memory/constitution.md." },
      { label: "specs/", indent: 1, title: "specs/", body: "intent فیچرها. وقتی رفتار مطلوب عوض شد این‌ها را به‌روز کنید، نه فقط tooling را." },
      { label: "003-chat-system/", indent: 2, title: "شاخه فیچر", body: "نام پوشه با branch معنایی یکی است؛ مثلاً 003-chat-system." },
      { label: "spec.md", indent: 3, title: "spec.md", body: "نیازمندی و داستان کاربر. بدون tech stack. ابهام با [NEEDS CLARIFICATION]." },
      { label: "plan.md", indent: 3, title: "plan.md", body: "ورودی لازم برای tasks. ترجمه فنی به‌همراه دروازه‌های مشروطه." },
      { label: "research.md", indent: 3, title: "research.md", body: "مقایسه گزینه‌ها؛ مثلاً کتابخانه WebSocket." },
      { label: "data-model.md", indent: 3, title: "data-model.md", body: "موجودیت‌ها و روابط؛ منبع استخراج task." },
      { label: "contracts/", indent: 3, title: "contracts/", body: "قرارداد API یا event. طبق template قبل از کد و همراه تست قرارداد." },
      { label: "quickstart.md", indent: 3, title: "quickstart.md", body: "سناریوهای اعتبارسنجی کلیدی برای انسان و agent." },
      { label: "tasks.md", indent: 3, title: "tasks.md", body: "کارهای اجرایی. [P] یعنی موازی‌سازی امن. قابل تبدیل به GitHub Issues." },
      { label: ".specify/", indent: 1, title: ".specify/", body: "tooling Spec Kit. ارتقای CLI این لایه را تازه می‌کند و لزوماً spec فیچر را عوض نمی‌کند." },
      { label: "templates/", indent: 2, title: "templates/", body: "هسته پیش‌فرض. پایین‌ترین اولویت نسبت به override و preset." },
      { label: "templates/overrides/", indent: 2, title: "overrides", body: "اولویت ۱: تنظیم یک‌باره همین پروژه بدون ساختن preset کامل." },
    ],
    en: [
      { label: "my-project/", indent: 0, title: "Project root", body: "After specify init, agent commands and tooling directories appear here." },
      { label: "memory/", indent: 1, title: "memory/", body: "Stable project principles. The Constitution is established once, and every plan must comply with it." },
      { label: "constitution.md", indent: 2, title: "constitution.md", body: "Nine governing articles. The team defines Articles IV–VI. Full path: memory/constitution.md." },
      { label: "specs/", indent: 1, title: "specs/", body: "Feature intent. Update these artifacts when desired behavior changes—not merely when tooling changes." },
      { label: "003-chat-system/", indent: 2, title: "Feature directory", body: "The directory follows the semantic branch name, such as 003-chat-system." },
      { label: "spec.md", indent: 3, title: "spec.md", body: "Requirements and user stories without a technology stack. Uncertainty is marked with [NEEDS CLARIFICATION]." },
      { label: "plan.md", indent: 3, title: "plan.md", body: "The required input for Tasks: a technical translation that includes constitutional gates." },
      { label: "research.md", indent: 3, title: "research.md", body: "Option analysis and technical rationale—for example, comparing WebSocket libraries." },
      { label: "data-model.md", indent: 3, title: "data-model.md", body: "Entities and relationships used to derive implementation tasks." },
      { label: "contracts/", indent: 3, title: "contracts/", body: "API or event contracts. Templates put contracts and their tests before implementation." },
      { label: "quickstart.md", indent: 3, title: "quickstart.md", body: "Key validation scenarios for both people and agents." },
      { label: "tasks.md", indent: 3, title: "tasks.md", body: "Executable work. [P] denotes safe parallelization. Tasks can also become GitHub Issues." },
      { label: ".specify/", indent: 1, title: ".specify/", body: "Spec Kit tooling. A CLI upgrade can refresh this layer without changing feature intent." },
      { label: "templates/", indent: 2, title: "templates/", body: "Core defaults with lower priority than project overrides and presets." },
      { label: "templates/overrides/", indent: 2, title: "overrides", body: "Priority 1: one-off customization for this project without creating a complete preset." },
    ],
  };

  const INSTALL_TREE = {
    fa: [
      { label: ".specify/", indent: 0, title: ".specify/ — پوشهٔ نصب Spec Kit", body: "خروجی <code>specify init</code> در این پروژه: نسخهٔ ۱.۰.۴، ایجنت cursor-agent، اسکریپت bash. اینجا <strong>ماشین‌آلات کیت</strong> است، نه spec محصول؛ مستندات فیچر همچنان زیر <code>specs/</code> می‌ماند." },
      { label: "init-options.json", indent: 1, title: "init-options.json", body: "عکس لحظه‌ای از انتخاب‌های نصب: <code>ai: cursor-agent</code> (فرمان‌ها به‌صورت skill در Cursor)، <code>ai_skills: true</code>، <code>script: sh</code>، <code>feature_numbering: sequential</code> (پوشهٔ 001-user-auth نه تاریخ)، <code>here: true</code> و <code>speckit_version: 1.0.4</code>. ارتقاها همین را می‌خوانند تا دوباره نپرسند و ایجنت‌ها را قاطی نکنند." },
      { label: "integration.json", indent: 1, title: "integration.json", body: "پیکربندی زمان اجرا: کدام ایجنت فعال است. <code>invoke_separator: \"-\"</code> یعنی در این پروژه فرمان‌ها <code>/speckit-specify</code> هستند، نه <code>/speckit.specify</code>. اسکریپت‌ها با تابع <code>get_invoke_separator</code> در common.sh همین را می‌خوانند تا پیام خطا نام درست فرمان را چاپ کند." },
      { label: ".gitignore", indent: 1, title: ".gitignore داخل کیت", body: "فقط فایل‌های <strong>مخصوص همین ماشین</strong> را نادیده می‌گیرد: <code>feature.json</code> (اشاره‌گر فیچر جاری که با هر جابه‌جایی بازنویسی می‌شود و در git تعارض می‌سازد) و <code>extensions/*/local-config.yml</code>. بقیهٔ کیت commit می‌شود." },
      { label: "memory/", indent: 1, title: "memory/ — قانون پروژه", body: "تنها بخشی از <code>.specify/</code> که محتوای فکری شماست، نه ابزار. <code>/speckit-plan</code> قبل از research و design یک دروازهٔ Constitution Check دارد که از اینجا تغذیه می‌شود." },
      { label: "constitution.md", indent: 2, title: "memory/constitution.md", body: "در نصب فعلی هنوز <strong>placeholder خام</strong> است: <code>[PROJECT_NAME]</code>، <code>[PRINCIPLE_1_NAME]</code> و … . یعنی دروازهٔ plan فعلاً خالی است. constitution واقعی تیم امروز در <code>specs/mission.md</code>، <code>specs/tech-stack.md</code> و <code>.cursor/rules</code> زندگی می‌کند." },
      { label: ".constitution-template.json", indent: 2, title: "memory/.constitution-template.json", body: "یک چک‌سام کوچک: هش SHA-256 قالب هستهٔ constitution به‌همراه <code>\"source\": \"core\"</code>. با آن معلوم می‌شود فایل شما هنوز دست‌نخورده است یا سفارشی شده، تا ارتقا اصول شما را کورکورانه بازنویسی نکند." },
      { label: "templates/", indent: 1, title: "templates/ — سندهای خالی", body: "skillها شکل سند را از خودشان درنمی‌آورند؛ این فایل‌ها را داخل <code>specs/&lt;feature&gt;/</code> کپی و سپس پر می‌کنند." },
      { label: "spec-template.md", indent: 2, title: "spec-template.md", body: "نقشهٔ <code>spec.md</code>؛ «چه چیزی» محصول، نه «چگونه». داستان‌های کاربر با اولویت P1/P2/P3، Given/When/Then، حالت‌های لبه، نیازمندی‌های FR-001…، موجودیت‌ها، معیارهای موفقیت قابل‌سنجش و ابهام‌ها با <code>[NEEDS CLARIFICATION: …]</code>. مصرف‌کننده: <code>create-new-feature.sh</code> و <code>/speckit-specify</code>." },
      { label: "plan-template.md", indent: 2, title: "plan-template.md", body: "نقشهٔ <code>plan.md</code>؛ «چگونه» فنی: خلاصه، زبان/وابستگی/ذخیره‌سازی/تست، بخش <strong>Constitution Check</strong>، سندهای جانبی مورد انتظار (<code>research.md</code>، <code>data-model.md</code>، <code>quickstart.md</code>، <code>contracts/</code>)، گزینه‌های ساختار کد و جدول پیچیدگی برای توجیه نقض مشروطه. مصرف‌کننده: <code>setup-plan.sh</code>." },
      { label: "tasks-template.md", indent: 2, title: "tasks-template.md", body: "نقشهٔ <code>tasks.md</code>: چک‌باکس‌های مرتب <code>T001</code>، <code>[P]</code> برای کار موازی و <code>[US1]</code> برای اتصال به داستان کاربر؛ فازهای Setup → Foundational → هر داستان → Polish. تسک‌های نمونه باید <strong>جایگزین</strong> شوند، نه رها." },
      { label: "checklist-template.md", indent: 2, title: "checklist-template.md", body: "نقشهٔ چک‌لیست بازبینی: کیفیت خودِ نیازمندی‌ها، نه «آیا کد را نوشتیم». <code>/speckit-checklist</code> پرش می‌کند و <code>/speckit-implement</code> می‌تواند آیتم‌های تیک‌نخورده را دروازه بگیرد — و اجازه ندارد خودش تیک بزند." },
      { label: "constitution-template.md", indent: 2, title: "constitution-template.md", body: "دقیقاً همان محتوایی که الان در <code>memory/constitution.md</code> نشسته است. منبع <code>/speckit-constitution</code> برای اولین‌بار پر کردن یا بازتولید constitution." },
      { label: "scripts/bash/", indent: 1, title: "scripts/bash/ — نیمهٔ قطعی کیت", body: "شش اسکریپت bash که skillهای Cursor واقعاً اجرا می‌کنند؛ با <code>--json</code> صدا زده می‌شوند تا ایجنت مسیرها را <em>بخواند</em> نه اینکه از خودش بسازد. جزئیات هر اسکریپت در اسلاید بعد." },
      { label: "integrations/", indent: 1, title: "integrations/ — رسید نصب", body: "کیت هنگام نصب فهرست می‌کند چه چیزی و کجا کاشته است." },
      { label: "speckit.manifest.json", indent: 2, title: "speckit.manifest.json", body: "فهرست فایل‌ها به‌همراه هش SHA-256 از <strong>هستهٔ کیت</strong> (اسکریپت‌ها، قالب‌ها، <code>.gitignore</code>) در تاریخ نصب. با آن refresh/upgrade می‌فهمد کدام فایل هنوز دست‌نخورده است و کدام را شما ویرایش کرده‌اید." },
      { label: "cursor-agent.manifest.json", indent: 2, title: "cursor-agent.manifest.json", body: "همان ایده برای <strong>skillهای Cursor</strong>: هش <code>.cursor/skills/speckit-analyze</code>، <code>clarify</code>، <code>constitution</code>، <code>implement</code>، <code>converge</code>، <code>plan</code>، <code>checklist</code>، <code>specify</code>، <code>tasks</code> و <code>taskstoissues</code>. خود skillها بیرون <code>.specify/</code> هستند؛ این فایل صورت‌حسابشان است." },
      { label: "workflows/", indent: 1, title: "workflows/ — اجراکنندهٔ اختیاری", body: "اگر نمی‌خواهید هر فرمان را دستی بزنید، کل چرخه را به‌صورت یک pipeline با توقف‌های بازبینی اجرا کنید." },
      { label: "workflow-registry.json", indent: 2, title: "workflow-registry.json", body: "می‌گوید workflow بستهٔ <code>speckit</code> با عنوان «Full SDD Cycle» نصب است." },
      { label: "speckit/workflow.yml", indent: 2, title: "workflows/speckit/workflow.yml", body: "خط لوله: specify → توقف انسانی → plan → توقف انسانی → tasks → implement. ورودی‌ها: شرح فیچر، integration (<code>auto</code> یعنی همین cursor-agent) و scope (<code>full</code> / backend-only / frontend-only). YAML هنوز Claude و Copilot و Gemini را به‌عنوان نمونه فهرست می‌کند، ولی با <code>auto</code> ایجنت این پروژه انتخاب می‌شود." },
      { label: "feature.json (بعداً)", indent: 1, title: "feature.json — بعد از اولین specify", body: "بعد از اولین <code>/speckit-specify</code> ساخته می‌شود و <code>feature_directory</code> جاری را نگه می‌دارد تا فرمان‌های بعدی بدانند روی کدام فیچر کار می‌کنند. در <code>.gitignore</code> است چون مخصوص همین ماشین است." },
      { label: "templates/overrides/ (بعداً)", indent: 1, title: "templates/overrides/ — اگر سفارشی کنید", body: "اگر شکل spec/plan/tasks را مخصوص تیم خود بخواهید، همین‌جا ساخته می‌شود و بالاترین اولویت را دارد. برای ساختار فعلی تیم ما احتمالاً از قالب‌های خام مناسب‌تر است." },
      { label: "presets/ + extensions/ (بعداً)", indent: 1, title: "presets/ و extensions/ — افزودنی‌ها", body: "هنوز وجود ندارند، پس در حال حاضر همه‌چیز از قالب‌های هسته می‌آید. جزئیات این لایه‌ها در اسلاید سفارشی‌سازی." },
    ],
    en: [
      { label: ".specify/", indent: 0, title: ".specify/ — the Spec Kit install folder", body: "What <code>specify init</code> dropped in this project: version 1.0.4, the cursor-agent integration, bash scripts. This is the kit's <strong>machinery</strong>, not your product specs; feature docs still live under <code>specs/</code>." },
      { label: "init-options.json", indent: 1, title: "init-options.json", body: "A snapshot of how the project was initialized: <code>ai: cursor-agent</code> (commands become Cursor skills), <code>ai_skills: true</code>, <code>script: sh</code>, <code>feature_numbering: sequential</code> (001-user-auth, not timestamps), <code>here: true</code>, and <code>speckit_version: 1.0.4</code>. Upgrades read this so they neither re-ask nor mix integrations." },
      { label: "integration.json", indent: 1, title: "integration.json", body: "Runtime config: which AI integration is active. <code>invoke_separator: \"-\"</code> means commands in this project are <code>/speckit-specify</code>, not <code>/speckit.specify</code>. Scripts read it through <code>get_invoke_separator</code> in common.sh so error messages print the right command names." },
      { label: ".gitignore", indent: 1, title: "The kit's own .gitignore", body: "Ignores only <strong>machine-local</strong> files: <code>feature.json</code> (the pointer to the current feature, rewritten whenever you switch features and guaranteed to fight in git) and <code>extensions/*/local-config.yml</code>. Everything else in the kit is committed." },
      { label: "memory/", indent: 1, title: "memory/ — project law", body: "The only part of <code>.specify/</code> that is your thinking rather than tooling. <code>/speckit-plan</code> runs a Constitution Check gate before research and design, fed from here." },
      { label: "constitution.md", indent: 2, title: "memory/constitution.md", body: "In this install it is still the <strong>stock placeholder</strong>: <code>[PROJECT_NAME]</code>, <code>[PRINCIPLE_1_NAME]</code>, and so on—so the plan gate is currently empty. The team's real constitution lives in <code>specs/mission.md</code>, <code>specs/tech-stack.md</code>, and <code>.cursor/rules</code>." },
      { label: ".constitution-template.json", indent: 2, title: "memory/.constitution-template.json", body: "A tiny checksum: the SHA-256 of the core constitution template plus <code>\"source\": \"core\"</code>. It reveals whether your constitution is still stock or already customized, so an upgrade never blindly overwrites your principles." },
      { label: "templates/", indent: 1, title: "templates/ — blank documents", body: "Skills do not invent document shape. They copy these files into <code>specs/&lt;feature&gt;/</code> and then fill them in." },
      { label: "spec-template.md", indent: 2, title: "spec-template.md", body: "The blueprint for <code>spec.md</code>: the product WHAT, not the HOW. Prioritized user stories (P1/P2/P3), Given/When/Then, edge cases, FR-001… requirements, entities, measurable success criteria, and <code>[NEEDS CLARIFICATION: …]</code> for gaps. Consumed by <code>create-new-feature.sh</code> and <code>/speckit-specify</code>." },
      { label: "plan-template.md", indent: 2, title: "plan-template.md", body: "The blueprint for <code>plan.md</code>: the technical HOW. Summary, language/dependencies/storage/testing, the <strong>Constitution Check</strong> section, expected companion docs (<code>research.md</code>, <code>data-model.md</code>, <code>quickstart.md</code>, <code>contracts/</code>), source-tree options, and a complexity table to justify constitutional violations. Consumed by <code>setup-plan.sh</code>." },
      { label: "tasks-template.md", indent: 2, title: "tasks-template.md", body: "The blueprint for <code>tasks.md</code>: ordered checkboxes <code>T001</code>, <code>[P]</code> for parallel-safe work, <code>[US1]</code> to tie a task to a user story; phases Setup → Foundational → per user story → Polish. Sample tasks must be <strong>replaced</strong>, not left in place." },
      { label: "checklist-template.md", indent: 2, title: "checklist-template.md", body: "The blueprint for reviewer checklists: requirements quality, not “did we write the code”. <code>/speckit-checklist</code> fills it, and <code>/speckit-implement</code> may treat unchecked items as a gate—while never ticking the boxes itself." },
      { label: "constitution-template.md", indent: 2, title: "constitution-template.md", body: "The same content currently sitting in <code>memory/constitution.md</code>. It is the source <code>/speckit-constitution</code> uses when first filling or regenerating the constitution." },
      { label: "scripts/bash/", indent: 1, title: "scripts/bash/ — the deterministic half", body: "Six bash scripts the Cursor skills actually run. Agents call them with <code>--json</code> so they <em>read</em> real paths instead of inventing folder names. The next slide covers each one." },
      { label: "integrations/", indent: 1, title: "integrations/ — install receipts", body: "At install time the kit records what it planted and where." },
      { label: "speckit.manifest.json", indent: 2, title: "speckit.manifest.json", body: "A file list with SHA-256 hashes of the <strong>core kit</strong> (scripts, templates, <code>.gitignore</code>) as of the install date. A refresh or upgrade uses it to see which files are still stock and which you edited." },
      { label: "cursor-agent.manifest.json", indent: 2, title: "cursor-agent.manifest.json", body: "The same idea for the <strong>Cursor skills</strong>: hashes of <code>.cursor/skills/speckit-analyze</code>, <code>clarify</code>, <code>constitution</code>, <code>implement</code>, <code>converge</code>, <code>plan</code>, <code>checklist</code>, <code>specify</code>, <code>tasks</code>, and <code>taskstoissues</code>. Those skills live outside <code>.specify/</code>; this file is their inventory." },
      { label: "workflows/", indent: 1, title: "workflows/ — optional full-cycle runner", body: "If you would rather not invoke each command by hand, run the whole loop as a pipeline with review stops." },
      { label: "workflow-registry.json", indent: 2, title: "workflow-registry.json", body: "Declares that the bundled workflow <code>speckit</code>, titled “Full SDD Cycle”, is installed." },
      { label: "speckit/workflow.yml", indent: 2, title: "workflows/speckit/workflow.yml", body: "The pipeline: specify → human gate → plan → human gate → tasks → implement. Inputs are the feature description, the integration (<code>auto</code> resolves to this project's cursor-agent), and scope (<code>full</code> / backend-only / frontend-only). The YAML still lists Claude, Copilot, and Gemini as examples." },
      { label: "feature.json (later)", indent: 1, title: "feature.json — after your first specify", body: "Created by the first <code>/speckit-specify</code> and holds the current <code>feature_directory</code> so later commands know which feature is active. It is gitignored because it is machine-local state." },
      { label: "templates/overrides/ (later)", indent: 1, title: "templates/overrides/ — if you customize", body: "Appears when you want project-specific spec/plan/tasks shapes, and it wins over every other layer. For our existing structure it would likely fit better than the stock templates." },
      { label: "presets/ + extensions/ (later)", indent: 1, title: "presets/ and extensions/ — optional add-ons", body: "Neither exists yet, so everything currently resolves to core templates. The customization slide covers these layers." },
    ],
  };

  const TREES = { artifacts: ARTIFACT_TREE, install: INSTALL_TREE };

  const CUSTOMIZATION = {
    fa: [
      {
        tab: "Extension",
        title: "می‌خواهیم باگ‌ها هم مسیر مشخص داشته باشند",
        scenario:
          "هسته Spec Kit فاز رسیدگی به باگ ندارد. extension رسمی bug سه فرمان جدید اضافه می‌کند: ارزیابی، اصلاح، و تست.",
        code: `specify extension add bug

/speckit.bug.assess "login crash on Safari" slug=login-crash
/speckit.bug.fix    slug=login-crash
/speckit.bug.test   slug=login-crash

# extension.yml
  id: bug
  provides.commands:
    - speckit.bug.assess -> commands/speckit.bug.assess.md
    - speckit.bug.fix    -> commands/speckit.bug.fix.md
    - speckit.bug.test   -> commands/speckit.bug.test.md`,
        result:
          "خروجی هر باگ در <code>.specify/bugs/login-crash/</code> می‌ماند و هسته دست‌نخورده باقی می‌ماند. extension دیگرِ همراه: assess برای سنجش ایده.",
      },
      {
        tab: "Preset",
        title: "همان فرمان‌ها، خروجی سبک‌تر",
        scenario:
          "فرمان‌ها درست کار می‌کنند ولی خروجی برای تیم ما طولانی است. preset رسمی lean همان فرمان‌ها را با قالب حداقلی جایگزین می‌کند.",
        code: `specify preset add lean

# preset.yml
  id: lean
  provides.templates:
    - name: speckit.specify   replaces: speckit.specify
    - name: speckit.plan      replaces: speckit.plan
    - name: speckit.tasks     replaces: speckit.tasks
    - name: speckit.implement replaces: speckit.implement`,
        result:
          "نام هیچ فرمانی عوض نمی‌شود؛ فقط شکل خروجی. preset‌های رسمی دیگر: scaffold و constitution-sync.",
      },
      {
        tab: "Bundle",
        title: "یک نقش کامل با یک فرمان",
        scenario:
          "یک PM جدید آمده و باید محیطش برای کشف نیاز و نوشتن spec آماده باشد. به‌جای نصب تک‌تک اجزا، bundle آن نقش را نصب می‌کنیم.",
        code: `specify bundle info product-manager
specify bundle install product-manager

# bundle.yml
  role: product-manager
  extensions: agent-context 1.0.0
  presets:    product-discovery 1.0.0 (priority 10, append)
  workflows:  spec-to-roadmap 1.0.0`,
        result:
          "<code>info</code> دقیقاً همان چیزی را نشان می‌دهد که <code>install</code> اضافه می‌کند، و <code>remove</code> فقط اجزای همین bundle را برمی‌دارد.",
      },
      {
        tab: "Overrides",
        title: "فقط برای همین پروژه",
        scenario:
          "در این پروژه هر task رابط کاربری باید تست کامپوننت Cypress داشته باشد. برای یک قانون کوچک، preset کامل نمی‌سازیم.",
        code: `cp .specify/templates/tasks-template.md \\
   .specify/templates/overrides/tasks-template.md

# سپس همان کپی را ویرایش کنید:
# "every UI task must add a Cypress component test"

/speckit.tasks -> overrides/tasks-template.md

# فایل‌های قابل override:
spec-template.md, plan-template.md, tasks-template.md,
constitution-template.md, checklist-template.md`,
        result:
          "قانون فقط در همین مخزن اعمال می‌شود و ارتقای CLI آن را پاک نمی‌کند، چون در لایه override شما نشسته است.",
      },
      {
        tab: "اولویت",
        title: "اگر چند لایه همزمان باشند؟",
        scenario:
          "وقتی agent یک template می‌خواهد، این چهار لایه از بالا به پایین گشته می‌شود و اولین تطابق برنده است.",
        code: `request: tasks-template.md
<span class="yes">1</span> .specify/templates/overrides/     -> match, used
<span class="no">2</span> .specify/presets/templates/       -> skipped
<span class="no">3</span> .specify/extensions/templates/    -> skipped
<span class="no">4</span> .specify/templates/ (core)        -> skipped`,
        result:
          "template‌ها در runtime حل می‌شوند، اما فرمان‌های extension و preset هنگام نصب داخل پوشه agent (مثل <code>.claude/commands/</code>) نوشته می‌شوند. اگر دو جزء یک فرمان بدهند، بالاترین اولویت برنده است و با حذف آن، نسخه بعدی برمی‌گردد.",
      },
    ],
    en: [
      {
        tab: "Extension",
        title: "We want bugs to follow a defined path too",
        scenario:
          "The Spec Kit core has no bug-handling phase. The official bug extension adds three commands: assess, fix, and test.",
        code: `specify extension add bug

/speckit.bug.assess "login crash on Safari" slug=login-crash
/speckit.bug.fix    slug=login-crash
/speckit.bug.test   slug=login-crash

# extension.yml
  id: bug
  provides.commands:
    - speckit.bug.assess -> commands/speckit.bug.assess.md
    - speckit.bug.fix    -> commands/speckit.bug.fix.md
    - speckit.bug.test   -> commands/speckit.bug.test.md`,
        result:
          "Each bug's output stays in <code>.specify/bugs/login-crash/</code> and the core remains untouched. The other bundled extension is assess, for evaluating an idea.",
      },
      {
        tab: "Preset",
        title: "Same commands, leaner output",
        scenario:
          "The commands work well, but their output is too long for our team. The official lean preset replaces them with a minimal format.",
        code: `specify preset add lean

# preset.yml
  id: lean
  provides.templates:
    - name: speckit.specify   replaces: speckit.specify
    - name: speckit.plan      replaces: speckit.plan
    - name: speckit.tasks     replaces: speckit.tasks
    - name: speckit.implement replaces: speckit.implement`,
        result:
          "No command name changes—only the shape of the output. Other official presets: scaffold and constitution-sync.",
      },
      {
        tab: "Bundle",
        title: "A complete role in one command",
        scenario:
          "A new product manager joins and needs an environment ready for discovery and specification. Instead of installing each piece, install the role bundle.",
        code: `specify bundle info product-manager
specify bundle install product-manager

# bundle.yml
  role: product-manager
  extensions: agent-context 1.0.0
  presets:    product-discovery 1.0.0 (priority 10, append)
  workflows:  spec-to-roadmap 1.0.0`,
        result:
          "<code>info</code> shows exactly what <code>install</code> adds, and <code>remove</code> takes back only this bundle's components.",
      },
      {
        tab: "Overrides",
        title: "For this project only",
        scenario:
          "In this project every UI task must carry a Cypress component test. That single rule does not justify authoring a full preset.",
        code: `cp .specify/templates/tasks-template.md \\
   .specify/templates/overrides/tasks-template.md

# then edit the copy:
# "every UI task must add a Cypress component test"

/speckit.tasks -> overrides/tasks-template.md

# templates you can override:
spec-template.md, plan-template.md, tasks-template.md,
constitution-template.md, checklist-template.md`,
        result:
          "The rule applies to this repository alone, and a CLI upgrade will not erase it because it lives in your override layer.",
      },
      {
        tab: "Priority",
        title: "What if several layers apply at once?",
        scenario:
          "When the agent needs a template, these four layers are searched top-down and the first match wins.",
        code: `request: tasks-template.md
<span class="yes">1</span> .specify/templates/overrides/     -> match, used
<span class="no">2</span> .specify/presets/templates/       -> skipped
<span class="no">3</span> .specify/extensions/templates/    -> skipped
<span class="no">4</span> .specify/templates/ (core)        -> skipped`,
        result:
          "Templates resolve at runtime, but extension and preset commands are written into the agent directory (such as <code>.claude/commands/</code>) at install time. If two components supply the same command, the highest priority wins, and removing it restores the next one.",
      },
    ],
  };

  const progress = document.getElementById("progress");
  const counter = document.getElementById("counter");
  const live = document.getElementById("slide-live");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const langBtn = document.getElementById("lang-toggle");
  const hint = document.querySelector(".hint");

  const decks = [...document.querySelectorAll(".lang-deck")].map((root) => ({
    lang: root.dataset.lang,
    root,
    slides: [...root.querySelectorAll(".slide")],
  }));

  let language = readStoredLanguage();
  let index = 0;

  function isKnownLanguage(candidate) {
    return decks.some((deck) => deck.lang === candidate);
  }

  function readStoredLanguage() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (isKnownLanguage(requested)) return requested;

    const stored = localStorage.getItem(STORAGE_KEY);
    return isKnownLanguage(stored) ? stored : decks[0].lang;
  }

  function updateUrl(position) {
    const params = new URLSearchParams(location.search);
    params.set("lang", language);
    try {
      history.replaceState(null, "", `?${params}#slide-${position}`);
    } catch {
      // Ignore history restrictions, for example when opened over file://
    }
  }

  function activeDeck() {
    return decks.find((deck) => deck.lang === language);
  }

  function parseHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    if (!match) return 0;
    const value = Number(match[1]) - 1;
    return Number.isNaN(value) ? 0 : value;
  }

  function show(nextIndex, updateHash = true) {
    const deck = activeDeck();
    const total = deck.slides.length;
    index = Math.min(Math.max(nextIndex, 0), total - 1);

    deck.slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });

    const strings = STRINGS[language];
    const position = index + 1;
    const formatted = position.toLocaleString(strings.locale);
    const totalFormatted = total.toLocaleString(strings.locale);

    progress.style.width = `${(position / total) * 100}%`;
    counter.textContent = `${formatted} / ${totalFormatted}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;

    const title = deck.slides[index].querySelector("h1, h2");
    live.textContent = strings.slideLabel(formatted, title ? title.textContent.trim() : "");

    if (updateHash) {
      updateUrl(position);
    }
  }

  function setLanguage(nextLanguage, { persist = true } = {}) {
    language = nextLanguage;
    const strings = STRINGS[language];

    decks.forEach((deck) => {
      deck.root.classList.toggle("is-active", deck.lang === language);
    });

    document.documentElement.lang = language;
    document.documentElement.dir = strings.dir;
    prevBtn.textContent = strings.prev;
    nextBtn.textContent = strings.next;
    langBtn.textContent = strings.toggle;
    langBtn.title = strings.toggleTitle;
    langBtn.setAttribute("aria-label", strings.toggleTitle);
    hint.textContent = strings.hint;

    if (persist) {
      localStorage.setItem(STORAGE_KEY, language);
    }

    show(index, persist);
  }

  function initQuizzes(deck) {
    deck.root.querySelectorAll(".quiz").forEach((quiz) => {
      const feedback = quiz.querySelector(".feedback");
      const options = [...quiz.querySelectorAll(".option")];

      options.forEach((option) => {
        option.addEventListener("click", () => {
          if (quiz.dataset.locked === "true") return;
          quiz.dataset.locked = "true";

          const isCorrect = option.dataset.correct === "true";
          options.forEach((item) => {
            item.disabled = true;
            if (item.dataset.correct === "true") item.classList.add("is-correct");
          });
          if (!isCorrect) option.classList.add("is-wrong");

          const strings = STRINGS[deck.lang];
          const explanation = quiz.dataset.explain || "";
          feedback.dataset.state = isCorrect ? "ok" : "bad";
          feedback.textContent = isCorrect
            ? strings.correct(explanation)
            : strings.incorrect(explanation);
        });
      });
    });
  }

  function initWorkflow(deck) {
    const stepsRoot = deck.root.querySelector("[data-role='workflow-steps']");
    const detail = deck.root.querySelector("[data-role='workflow-detail']");
    if (!stepsRoot || !detail) return;

    const steps = WORKFLOW_STEPS[deck.lang];
    let stepIndex = 0;

    steps.forEach((step, position) => {
      const element = document.createElement("article");
      element.className = "step";
      element.innerHTML = `<strong>${step.title}</strong><small dir="ltr">${step.command}</small>`;
      element.addEventListener("click", () => {
        stepIndex = position;
        render();
      });
      stepsRoot.appendChild(element);
    });

    function render() {
      [...stepsRoot.children].forEach((element, position) => {
        element.classList.toggle("is-active", position === stepIndex);
        element.classList.toggle("is-done", position < stepIndex);
      });
      const step = steps[stepIndex];
      detail.textContent = `${step.title}: ${step.detail}`;
    }

    deck.root.querySelector("[data-workflow='next']").addEventListener("click", () => {
      stepIndex = Math.min(stepIndex + 1, steps.length - 1);
      render();
    });
    deck.root.querySelector("[data-workflow='prev']").addEventListener("click", () => {
      stepIndex = Math.max(stepIndex - 1, 0);
      render();
    });
    deck.root.querySelector("[data-workflow='reset']").addEventListener("click", () => {
      stepIndex = 0;
      render();
    });

    render();
  }

  function initTree(deck) {
    deck.root.querySelectorAll("[data-role='tree']").forEach((tree) => {
      const layout = tree.closest(".tree-layout") || deck.root;
      const treeDetail = layout.querySelector("[data-role='tree-detail']");
      const source = TREES[tree.dataset.tree];
      if (!treeDetail || !source) return;

      source[deck.lang].forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `tree-btn indent-${item.indent}`;
        button.textContent = item.label;
        button.addEventListener("click", () => {
          tree.querySelectorAll(".tree-btn").forEach((element) => element.classList.remove("is-active"));
          button.classList.add("is-active");
          treeDetail.innerHTML = `<h3 dir="auto">${item.title}</h3><p>${item.body}</p>`;
        });
        tree.appendChild(button);
      });
    });
  }

  function initArticles(deck) {
    const articles = deck.root.querySelector("[data-role='articles']");
    if (!articles) return;

    articles.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        articles.querySelectorAll("button").forEach((element) => element.classList.remove("is-open"));
        button.classList.add("is-open");
      });
    });
  }

  function initCustomization(deck) {
    const buttonsRoot = deck.root.querySelector("[data-role='custom-buttons']");
    const panel = deck.root.querySelector("[data-role='custom-panel']");
    if (!buttonsRoot || !panel) return;

    const entries = CUSTOMIZATION[deck.lang];
    let current = 0;

    entries.forEach((entry, entryIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tab-btn";
      button.textContent = entry.tab;
      button.addEventListener("click", () => {
        current = entryIndex;
        render();
      });
      buttonsRoot.appendChild(button);
    });

    function render() {
      [...buttonsRoot.children].forEach((button, buttonIndex) => {
        button.classList.toggle("is-active", buttonIndex === current);
        button.setAttribute("aria-pressed", String(buttonIndex === current));
      });

      const entry = entries[current];
      panel.innerHTML = `<h3>${entry.title}</h3>
        <p class="rule">${entry.scenario}</p>
        <span class="example example--pre" dir="ltr">${entry.code}</span>
        <p class="panel-result">${entry.result}</p>`;
    }

    render();
  }

  function initComparison(deck) {
    const compare = deck.root.querySelector("[data-role='compare']");
    if (!compare) return;

    const items = [...compare.querySelectorAll("li")];
    const lastStep = Math.max(...items.map((item) => Number(item.dataset.step)));
    let step = -1;

    function render() {
      items.forEach((item) => {
        item.classList.toggle("is-on", Number(item.dataset.step) <= step);
      });
    }

    deck.root.querySelector("[data-compare='next']").addEventListener("click", () => {
      step = Math.min(step + 1, lastStep);
      render();
    });
    deck.root.querySelector("[data-compare='reset']").addEventListener("click", () => {
      step = -1;
      render();
    });

    render();
  }

  decks.forEach((deck) => {
    initQuizzes(deck);
    initWorkflow(deck);
    initTree(deck);
    initArticles(deck);
    initCustomization(deck);
    initComparison(deck);
  });

  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  langBtn.addEventListener("click", () => {
    const other = decks.find((deck) => deck.lang !== language);
    setLanguage(other.lang);
  });

  document.addEventListener("keydown", (event) => {
    if (event.target.closest("button, a, input, textarea, select")) return;

    const forwardKey = STRINGS[language].dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backwardKey = STRINGS[language].dir === "rtl" ? "ArrowRight" : "ArrowLeft";

    if (event.key === forwardKey || event.key === " ") {
      event.preventDefault();
      show(index + 1);
    }
    if (event.key === backwardKey) {
      event.preventDefault();
      show(index - 1);
    }
  });

  window.addEventListener("hashchange", () => show(parseHash(), false));

  index = parseHash();
  setLanguage(language, { persist: false });
})();
