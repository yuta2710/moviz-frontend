"use client";

import { ArticleProps } from "@/types";
import { HOST_PRODUCT, getRandomPhotoUrl } from "@/utils/clients.utils";
import { formatDate, formatHistoryDate } from "@/utils/convert.utils";
import { CircularProgress, Pagination, styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));

  console.log("Query result = ", page);

  const [news, setNews] = useState<ArticleProps[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfArticlesPerPage] = useState(0.5);
  const router = useRouter();
  const path = usePathname();

  const StyledPagination = styled(Pagination)(({ theme }) => ({
    button: {
      color: '#fff', // Change the color of inactive page numbers here
    },
  }));


  useEffect(() => {
    if (!page || currentPage === 1) {
      router.push(`/news?page=${currentPage}`);
    }
    const fetchData = async (pageNumber: number) => {
      const response = await fetch(
        `${HOST_PRODUCT}/api/v1/articles?page=${pageNumber}`
      );

      const data = response.json();
      data.then((json) => {
        const data = json.data;
        if (data.status === "OK") {
          setNews(data.response.docs);
        }
      });
    };

    fetchData(currentPage);
  }, [currentPage, router]);

  const indexOfLastArticle = currentPage * numberOfArticlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - numberOfArticlesPerPage;
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`/news?page=${pageNumber}`);
  };

  return <div className="container my-12 mx-auto px-4 md:px-12 relative md:mt-16">
    <div className="flex flex-row">
      {/* <div className="blob relative"></div> */}
      <div className="blob-linear-yellow-blue relative"></div>
    </div>
    <h1 className="text-white text-xl font-semibold tracking-wide">Latest News</h1>

    <ul className="grid grid-cols-3 relative gap-3">
      {news.length > 0
        ? news
          .slice(0, 3)
          .sort((a: ArticleProps, b: ArticleProps) => new Date(b.pub_date).getTime() - new Date(a.pub_date).getTime())
          .map((newsItem) =>
            <div className="my-1 px-1 lg:my-4 lg:px-0 util-box-shadow-light-mode rounded-lg">
              {/* <!-- Article --> */}
              <article className="overflow-hidden rounded-lg">
                <Link href={newsItem.web_url} className="" target="_blanket">
                  <Image alt="Placeholder" className="block h-auto w-full" src={`https://www.nytimes.com/${newsItem.multimedia[5].url}`} width={120} height={0} style={{}}></Image>
                </Link>

                <header className="flex items-center justify-between leading-tight p-2 md:p-4 md:w-full overflow-hidden">
                  <h1 className="md:text-sm font-regular md:w-full">
                    <Link className="no-underline hover:underline text-white" href={newsItem.web_url} target="_blanket">
                      <span className="text-white md:text-sm text-[0.7rem]">{newsItem.abstract}</span>
                    </Link>
                  </h1>
                </header>
                <p className="text-white text-left ellipsis md:ml-4 text-[0.7rem] md:p-0 px-2 md:text-sm">{newsItem.lead_paragraph}</p>

                <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                  <Link className="flex items-center no-underline hover:underline text-white" href={newsItem.web_url} target="_blanket">
                    <Image alt="Placeholder" className="block rounded-full" src={getRandomPhotoUrl(Math.floor(Math.random() * 131) + 1)} width={32} height={32} style={{ height: "32px" }}></Image>
                    <p className="ml-2 md:text-sm text-[0.6rem]">
                      {newsItem.byline.original.split(" ")[0]} <span className="text-white font-semibold">{newsItem.byline.original.split(" ")[1]} {newsItem.byline.original.split(" ")[2]}</span>
                    </p>
                  </Link>
                  {/* <a className="no-underline text-grey-darker hover:text-red-dark" href="#">
                  <span className="hidden">Like</span>
                  <i className="fa fa-heart"></i>
                </a> */}
                  <p className="text-white text-[0.6rem] font-medium md:text-[0.8rem] ml-10 md:m-0">{formatHistoryDate(newsItem.pub_date)}</p>
                </footer>

              </article>

            </div>
          )
        : <CircularProgress color="secondary" className="md:mt-2" />
      }
    </ul>
    <h1 className="text-white text-xl font-semibold tracking-wide md:mt-16 mt-16">Another News</h1>
    <div className="flex flex-wrap -mx-1 lg:-mx-4 mt-8 md:mt-0">
      {/* <!-- Column --> */}
      {news.length > 0
        ? news
          .slice(3,)
          .sort((a: ArticleProps, b: ArticleProps) => new Date(a.pub_date).getTime() - new Date(b.pub_date).getTime())
          .map((article, index) => (
            <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 cursor-pointer">

              {/* <!-- Article --> */}
              <article className="overflow-hidden rounded-lg shadow-lg ">

                <Link href={article.web_url} target="_blanket">
                  <Image alt="Placeholder" className="block h-auto w-full" src={`https://www.nytimes.com/${article.multimedia[5].url}`} width={article.multimedia[5].width} height={article.multimedia[5].height}></Image>
                </Link>

                <header className="flex items-center justify-between leading-tight p-2 md:p-4 md:w-full overflow-hidden">
                  <h1 className="text-lg">
                    <Link className="no-underline hover:underline text-white md:text-[1.2rem] font-semibold" href={article.web_url} target="_blanket">
                      <span className="text-white">{article.abstract}</span>
                    </Link>
                  </h1>
                </header>
                <p className="text-white text-left ellipsis md:ml-4 text-sm">{article.lead_paragraph}</p>

                <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                  <Link className="flex items-center no-underline hover:underline text-white" href={article.web_url} target="_blanket">
                    <Image alt="Placeholder" className="block rounded-full" src={getRandomPhotoUrl(Math.floor(Math.random() * 131) + 1)} width={32} height={32} style={{ height: "32px" }}></Image>
                    <p className="ml-2 text-sm">
                      {article.byline.original.split(" ")[0]} <span className="text-white font-semibold">{article.byline.original.split(" ")[1]} {article.byline.original.split(" ")[2]}</span>
                    </p>
                    <p className="text-white text-sm font-medium relative md:ml-4 opacity-60">{formatHistoryDate(article.pub_date)}</p>
                  </Link>
                  <Link className="no-underline text-grey-darker hover:text-red-dark" href={article.web_url} target="_blanket">
                    <span className="hidden">Like</span>
                    <i className="fa fa-heart"></i>
                  </Link>
                </footer>

              </article>

            </div>
          ))
        : <CircularProgress color="secondary" className="md:mt-2" />
      }
      {/* 
        <!-- END Column --> */}

    </div>
    {news.length > 0 && (
      <div className="flex justify-center w-full md:mt-16 mt-16">
        <StyledPagination
          count={Math.ceil(news.length / numberOfArticlesPerPage)}
          page={currentPage}
          onChange={(event, page) => paginate(page)}
          size="large"
          color="secondary"
          variant="outlined"
        />
      </div>
    )}
  </div>


}

