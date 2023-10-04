import type { ComponentChildren, JSX } from "preact";

interface Props extends JSX.HTMLAttributes<HTMLElement> {
  children: ComponentChildren;
  class?: string;
}

export function FullHeightSection(props: Props) {
  const { children, "class": className = "", ...rest } = props;
  return (
    <section
      class={"box-border full-height-sec p-4 md:px-16 md:py-8 " + className}
      {...rest}
    >
      {children}
    </section>
  );
}
