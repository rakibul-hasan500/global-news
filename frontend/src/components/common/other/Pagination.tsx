"use client"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter, useSearchParams, usePathname } from "next/navigation"

function Pagination({pagination}: any){

    // URL
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()

    // Prev
    const prev = ()=>{
        if(pagination?.hasPrevPage){
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", (pagination?.page - 1).toString())
            router.replace(`${pathName}?${params.toString()}`)
        }
    }

    // Next
    const next = ()=>{
        if(pagination?.hasNextPage){
            const params = new URLSearchParams(searchParams.toString())
            params.set("page", pagination?.page + 1)
            router.replace(`${pathName}?${params.toString()}`)
        }
    }

    // Go To Page
    const goToPage = (page: any) =>{
        if(page === "...") return
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page)
        router.replace(`${pathName}?${params.toString()}`)
    }


    return(
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
            {/* Info Text */}
            <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{pagination?.from || 0}</span> -{" "}
                <span className="font-medium text-gray-900">{pagination?.to || 0}</span> of{" "}
                <span className="font-medium text-gray-900">{pagination?.totalItems || 0}</span> items
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-2">
                {/* Prev */}
                <button onClick={prev} className={`${pagination?.hasPrevPage ? "cursor-pointer hover:bg-primary-hover hover:text-white" : "cursor-not-allowed"} w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition`}>
                    <FaChevronLeft size={12} />
                </button>

                {/* Pages */}
                {(()=>{

                    const getPages = ()=>{

                        const currentPage = pagination?.page || 1
                        const totalPages = pagination?.totalPages || 1

                        const pages = []

                        if(totalPages < 7){
                            for(let i = 1; i <= totalPages; i++){
                                pages.push(i)
                            }
                        }else{
                            // 1st Page
                            pages.push(1)

                            // Current Page Less Then 3
                            if(currentPage < 3){
                                for(let i = 1; i <= 3; i++){
                                    if(i === 1){
                                        continue;
                                    }else{
                                        pages.push(i)
                                    }
                                }
                            }


                            const start = currentPage - 1
                            const end = currentPage + 1

                            if(start - 1 > 1 && start < totalPages){
                                pages.push("...")
                            }

                            if(currentPage >= 3){
                                for(let i = currentPage === totalPages ? start - 1 : start; i <= end; i++){
                                    if(i < totalPages){
                                        pages.push(i)
                                    }
                                }
                            }

                            if(end <= totalPages - 2){
                                pages.push("...")
                            }

                            // Last Page
                            pages.push(totalPages)

                        }

                        return pages

                    }

                    return(
                        <>
                            {getPages().map((page, i)=>(
                                <button key={i} onClick={()=>goToPage(page)} className={`${pagination?.page === page ? "text-white bg-primary" : "text-gray-700 hover:bg-primary/20"} w-9 h-9 rounded-lg border border-gray-200 text-sm transition cursor-pointer`}>
                                    {page}
                                </button>
                            ))}
                        </>
                    )

                })()}

                {/* Next */}
                <button onClick={next} className={`${pagination?.hasNextPage ? "cursor-pointer hover:bg-primary-hover hover:text-white" : "cursor-not-allowed"} w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition`}>
                    <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}

export default Pagination;