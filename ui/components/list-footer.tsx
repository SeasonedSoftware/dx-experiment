import FilterMenu from './filter-menu'

interface IProps {
  filters: string[]
  current: string
  tasks: any[]
  clearAll(): void
}

export default function ListFooter({
  tasks,
  clearAll,
  filters,
  current,
}: IProps) {
  return (
    <footer className="footer relative flex justify-between py-2 px-4 border-t dark:border-gray-600 text-gray-700 dark:text-gray-100 font-thin">
      <span className="todo-count">
        <strong>{tasks.filter((t) => !t.completed).length}</strong> item left
      </span>
      <FilterMenu filters={filters} current={current} />
      {tasks.some((task) => task.completed) && (
        <button
          className="relative font-thin hover:underline z-10"
          onClick={clearAll}
        >
          Clear completed
        </button>
      )}
    </footer>
  )
}
