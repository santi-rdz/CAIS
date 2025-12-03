import { PAGE_SIZE } from '@lib/constants'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { useSearchParams } from 'react-router-dom'

export default function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currPage = +(searchParams.get('page') ?? 1)
  const pageCount = Math.ceil(count / PAGE_SIZE)

  function nextPage() {
    if (currPage === pageCount) return
    const next = currPage + 1
    searchParams.set('page', next)
    setSearchParams(searchParams)
  }

  function prevPage() {
    if (currPage === 1) return
    const next = currPage - 1
    searchParams.set('page', next)
    setSearchParams(searchParams)
  }

  if (pageCount <= 1) return null

  return (
    <div className="flex w-full items-center justify-between">
      <p className="ml-2 text-sm">
        Pagina <span className="font-semibold">{currPage}</span> <span>de</span> <span>{pageCount}</span> - Resultados:{' '}
        <span className="font-semibold">{count}</span>
      </p>

      <div className="flex gap-1.5">
        <button
          onClick={prevPage}
          disabled={currPage === 1}
          className="flex items-center justify-center gap-1 rounded-sm border-none bg-gray-50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-green-800 hover:text-green-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-inherit"
        >
          <HiChevronLeft className="h-[1.8rem] w-[1.8rem]" />
          <span>Anterior</span>
        </button>

        <button
          onClick={nextPage}
          disabled={currPage === pageCount}
          className="flex items-center justify-center gap-1 rounded-sm border-none bg-gray-50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-green-800 hover:text-green-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-inherit"
        >
          <span>Siguiente</span>
          <HiChevronRight className="h-[1.8rem] w-[1.8rem]" />
        </button>
      </div>
    </div>
  )
}
