import { IArticle } from "@/common/types/article.type"
import { validatePath,  } from "@/utils/string.util"
import { ReactEventHandler, useCallback, useEffect, useMemo, useState } from "react"

interface IProps  {
    articleData: IArticle, 
    onError?: ReactEventHandler<HTMLImageElement>, 
    onImageListingChange?: (imgPath: string, article: IArticle) => void,
    isLoading?: boolean
}

const ArticleCard = ({  articleData, onError, onImageListingChange, isLoading }: IProps) => {
    const IMAGE_ORIGIN = 'https://www.globe.com.ph'
    const [notFound, setNotFound] = useState(false)
    const [imgPath, setImgPath] = useState(articleData.imageListing || '') // Initialize with articleData.imageListing

    const onSubmitImage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onImageListingChange?.(imgPath, articleData);
    }

    const errorStyle = useMemo(() => {
        if (imgPath && !validatePath(imgPath)) {
            return 'border-2 border-red-400 text-red-500'
        }
    }, [imgPath])

    return (
        <div className="flex flex-col gap-3 pb-3 relative">
            {isLoading && (
                <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-blue-600 flex justify-center items-center">
                    <b>LOADING...</b>
                </div>
            )}
            {notFound ? (
                <form onSubmit={onSubmitImage} className="flex h-[190px] bg-gray-300 items-center">
                    <div className="flex flex-col gap-2 w-100 flex-grow">
                        <small className="text-red-500">Missing Image, Please upload new and update here.</small>
                        <input
                            defaultValue={articleData.imageListing}
                            onChange={(e) =>setImgPath(e.target.value)}
                            type="text"
                            placeholder="Enter path image."
                            className={`p-1 ${errorStyle}`}
                        />
                        <button type="submit" className="p-3 bg-blue-500 text-white">
                            SAVE
                        </button>
                    </div>
                </form>
            ) : (
                <img
                    onError={() => {
                        setNotFound(true);
                    }}
                    src={IMAGE_ORIGIN + articleData.imageListing}
                    width={1000}
                    height={1000}
                    alt=""
                />
            )}
            <b><a href={articleData.articleUrl} target="_blank">{articleData.title}</a></b>
            <small>{articleData.description}</small>
        </div>
    );
}

export default ArticleCard;
