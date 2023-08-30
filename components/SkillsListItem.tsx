interface Props {
  text: string;
}

export function SkillsListItem(props: Props) {
  const { text } = props;
  return (
    <li
      data-animation="animate__fadeInLeft"
      class="px-4 py-2 text-xl bg-gray-100 rounded dark:bg-gray-900 bg-opacity-20 backdrop-filter backdrop-blur dark:mix-blend-overlay"
    >
      {text}
    </li>
  );
}
