import names from "./component-list.json";
import { TemplateComponent } from "./TemplateComponent";
const templates = import.meta.glob("./templates/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
export class HomePage {
  private components: TemplateComponent[] = [];
  mount(root: Element): void {
    const wrapper = document.createElement("div");
    wrapper.className = "transition-wrapper";
    root.append(wrapper);
    for (const name of ["master-preloader", "noise", "preloader", "transition"])
      this.append(name, wrapper);
    const main = document.createElement("main");
    main.className = "transition-container clip";
    main.dataset.barba = "container";
    main.dataset.barbaNamespace = "home";
    wrapper.append(main);
    names.forEach((name) => this.append(name, main));
    this.append("landscape-cover", wrapper);
  }
  private append(name: string, parent: Element): void {
    const component = new TemplateComponent(
      name,
      templates[`./templates/${name}.html`],
    );
    component.mount(parent);
    this.components.push(component);
  }
  destroy(): void {
    this.components.forEach((component) => component.destroy());
    this.components = [];
  }
}
