import Button from '@components/Button'

// Botón "Cargar más" para listas con useInfiniteList. No renderiza nada si no
// hay más páginas (compatible con hooks que no son infinite: hasNextPage undefined).
export default function LoadMore({ hasNextPage, isFetchingNextPage, onLoadMore, loaded, count }) {
  if (!hasNextPage) return null

  return (
    <div className="flex justify-center pt-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onLoadMore()}
        isLoading={isFetchingNextPage}
        disabled={isFetchingNextPage}
      >
        Cargar más{count ? ` (${loaded}/${count})` : ''}
      </Button>
    </div>
  )
}
