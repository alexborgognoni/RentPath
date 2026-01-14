# Agent Pipeline Patterns

Guidelines for coordinating agents in multi-step workflows.

## Agent Overview

| Agent             | Model  | Purpose                            | Tools                           |
| ----------------- | ------ | ---------------------------------- | ------------------------------- |
| `feature-analyst` | opus   | Map features, plan implementations | Read-only + Laravel Boost       |
| `architect`       | sonnet | System design, module boundaries   | All (inherits `refactor` skill) |
| `domain-expert`   | sonnet | Business rules, workflows          | Read-only + database queries    |
| `frontend`        | sonnet | React/UI implementation            | All (inherits `wizard-field`)   |
| `testing-expert`  | sonnet | Test strategy, Pest patterns       | All (inherits `test-feature`)   |
| `code-reviewer`   | sonnet | Quality review, security           | Read + Bash (lint/test)         |
| `infrastructure`  | sonnet | AWS, Terraform, DevOps             | Read-only + web research        |

## Common Pipelines

### New Feature Development

```
1. feature-analyst → Understand existing patterns, plan implementation
2. architect       → Design architecture, decide service boundaries
3. [implementation] → Write code following plans
4. testing-expert  → Design test strategy, write tests
5. code-reviewer   → Final quality review
```

### Understanding Existing Feature

```
1. feature-analyst → Map complete file structure
2. domain-expert   → Explain business rules
3. architect       → Explain design decisions
```

### Refactoring Complex Code

```
1. architect       → Analyze current structure, design target state
2. feature-analyst → Map all affected files
3. [refactoring]   → Implement changes incrementally
4. testing-expert  → Update/add tests
5. code-reviewer   → Verify refactoring quality
```

### Adding Wizard Field

```
1. domain-expert   → Clarify business requirements
2. frontend        → Plan UI implementation
3. [implementation]→ Use /wizard-field skill
4. testing-expert  → Write validation tests
```

### Infrastructure Changes

```
1. infrastructure  → Plan Terraform changes (read-only analysis)
2. [manual review] → User reviews plan before apply
3. [apply]         → User executes terraform apply
```

## When to Delegate

### Use `feature-analyst` when:

- Need to understand complete feature before changes
- Planning where new code should go
- Mapping dependencies for refactoring

### Use `architect` when:

- Deciding between patterns (service vs action vs controller)
- Designing new module boundaries
- Planning major refactoring

### Use `domain-expert` when:

- Clarifying business rules
- Understanding status transitions
- Validating field requirements by context (employment type, etc.)

### Use `frontend` when:

- Complex React component design
- State management decisions
- Accessibility review

### Use `testing-expert` when:

- Designing test strategy for complex feature
- Debugging flaky tests
- Planning factory states

### Use `code-reviewer` when:

- Ready to merge (final review)
- Security concerns
- Pattern adherence check

### Use `infrastructure` when:

- AWS resource questions
- Deployment issues
- Environment configuration

## Parallel vs Sequential

### Run in Parallel

Independent research that doesn't depend on each other:

```
Parallel: feature-analyst (map frontend) + domain-expert (clarify rules)
```

### Run Sequentially

When output of one informs the next:

```
Sequential: architect (design) → testing-expert (test strategy for design)
```

## Agent Communication

Agents can reference each other in their responses. When an agent identifies work outside its scope, it should recommend the appropriate next agent:

```markdown
## Recommendations

This refactoring touches business rules I'm not certain about.
Recommend invoking **domain-expert** to clarify:

- What happens when application is withdrawn during visit_scheduled?
- Should notifications be sent in this case?
```

## Skills Inheritance

Some agents inherit skills automatically:

| Agent             | Inherited Skills              |
| ----------------- | ----------------------------- |
| `architect`       | `refactor`                    |
| `feature-analyst` | `new-feature`, `wizard-field` |
| `frontend`        | `wizard-field`                |
| `testing-expert`  | `test-feature`                |

This means when you invoke these agents, they have access to the skill's knowledge without needing to load it separately.

## Tool Restrictions

Security-sensitive agents have restricted tool access:

| Agent             | Restriction Reason                    |
| ----------------- | ------------------------------------- |
| `infrastructure`  | Prevents accidental infra changes     |
| `domain-expert`   | Read-only research, no code execution |
| `feature-analyst` | Analysis only, no modifications       |
| `code-reviewer`   | Can run lint/tests but not modify     |

Agents like `architect`, `frontend`, and `testing-expert` have full tool access because their work requires code generation.
