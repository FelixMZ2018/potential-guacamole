DataFlow

x6 -> GraphTools

GraphTools -> GraphToWorkflowDefintion -> returns new WorkflowDefinition
GraphTools -> GraphToWorkflowUIConfig > returns new ui config

GraphTools ( workflowdef, uiConfig ) -> NodeGenerator(graphCompatibleJson) -> Graph.fromJson
