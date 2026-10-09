export interface Component {
  readonly name: string;
  mount(parent: Element): void;
  destroy(): void;
}
/** Original semantic markup is kept separately from its TypeScript controller. */
export class TemplateComponent implements Component {
  private nodes: Node[] = [];
  constructor(
    readonly name: string,
    private readonly markup: string,
  ) {}
  mount(parent: Element): void {
    const template = document.createElement("template");
    template.innerHTML = this.markup;
    this.nodes = Array.from(template.content.childNodes);
    parent.append(template.content);
  }
  destroy(): void {
    this.nodes.forEach((node) => node.parentNode?.removeChild(node));
    this.nodes = [];
  }
}
