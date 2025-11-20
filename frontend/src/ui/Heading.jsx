const headingStyle = {
  h1: "text-1 font-medium font-lato",
};
export default function Heading({ children, as = "h1" }) {
  const Tag = as;
  return <Tag className={headingStyle[as]}>{children}</Tag>;
}
