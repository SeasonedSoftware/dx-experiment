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
    <footer className="footer">
      <span className="todo-count">
        <strong>{tasks.filter((t) => !t.completed).length}</strong> item left
      </span>
      <FilterMenu filters={filters} current={current} />
      {tasks.some((task) => task.completed) && (
        <button className="clear-completed" onClick={clearAll}>
          Clear completed
        </button>
      )}
    </footer>
  )
}
