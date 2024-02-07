import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { IArticle } from "@/common/types/article.type";
import useApiRequest from "@/hooks/useApiRequest";
import { objectToQueryString } from "@/utils/object";
import ArticleCard from "@/components/article";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const API_PATH = '/api/articles'
  const router = useRouter()
  const [filter, setFilter] = useState({
    paginate: router.query.paginate || 1,
    title: undefined,
    type: undefined
  })
  const [articles, setArticles] = useState<IArticle[]>([])

  const { data, loading, run: getArticles } = useApiRequest()
  const { loading: updateArticleLoading, run: updateArticle } = useApiRequest()

  const [loadingArticle, setLoadingArticle] = useState('')

  const handlePageClick = (item: any) => {
    window.location.href= router.basePath + '?paginate=' + (item.selected + 1)
  }

  const handleImageListingChange = async (imageListing: string, article: IArticle) => {
    // FOR TESTING
    // setArticles(tempArticles => {
    //   let temp = [...tempArticles]
    //   temp.forEach(a => {
    //     if (article && a.title === article.title) {
    //       a.imageListing = imageListing 
    //     }
    //   })
    //   return temp
    // })
    try {
      setLoadingArticle(article?.title!)
      await updateArticle(API_PATH + objectToQueryString({ paginate: router.query?.paginate || 1 }), {
        method: 'POST',
        data: {
          ...article,
          imageListing
        }
      })
    } catch(error) {
      alert(error)
    }
    setLoadingArticle('')
    router.reload()
  }

  useEffect(() => {
    if (data?.data.length > 0) {
      setArticles(data.data)
    }
  }, [data])

  useEffect(() => {
    if (router.isReady) {
      getArticles(API_PATH + objectToQueryString({ paginate: router.query?.paginate || 1}), {
        method: 'GET'
      })
    }
  }, [router])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="grid grid-cols-4 gap-4">
        {articles.map((article, ) => <ArticleCard 
            key={article.title + '-' + Math.floor(Math.random() * 1000)} 
            isLoading={loadingArticle === article.title} 
            onImageListingChange={handleImageListingChange} 
            articleData={article} 
        />)}
      </div>

      <br />
      <ReactPaginate
        containerClassName="border rounded-md flex gap-3 items-center"
        activeClassName="font-bold text-blue-500"
        pageClassName="p-3"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={10}
        pageCount={300}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        forcePage={(Number(router.query?.paginate) - 1) || 0}
      />
    </main>
  );
}
