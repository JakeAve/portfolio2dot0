interface Props {
  text: string;
}

export function SkillsListItem(props: Props) {
  const { text } = props;
  return (
    <li
      data-animation="animate__fadeInLeft"
      class="px-4 py-2 text-xl bg-gray-100/20 rounded dark:bg-gray-900/20 backdrop-blur dark:mix-blend-overlay"
    >
      {text}
    </li>
  );
}
