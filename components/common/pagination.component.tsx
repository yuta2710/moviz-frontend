import { PaginationProps } from "@/types";
import Link from "next/link";

export const Pagination = (props: PaginationProps) => {
  const pages = [];

  for (let i = 1; i < Math.ceil(props.lengthOfList / props.numberOfListPerPage); i++) {
    pages.push(i);
  }

  console.log(props)

  console.log(pages);
  return (
    <nav>
      <ul className="pagination flex flex-row justify-center items-center">
        {pages.map(number => (
          <li key={number} className="page-item text-white md:px-2">
            <Link onClick={() => { props.setPaginate(number); }} href={"/movies"} className="page-link text-white">{number}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
