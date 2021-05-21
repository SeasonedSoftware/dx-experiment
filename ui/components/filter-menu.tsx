import Link from 'next/link'
import startCase from 'lodash/startCase'
import { clsx } from 'lib/utils'

interface ILinkProps {
  filter: string
  active: boolean
}

const FilterLink = ({ filter, active }: ILinkProps) => (
  <li>
    <Link href={`/${filter}`}>
      <a className={clsx([active && 'selected'])}>{startCase(filter)}</a>
    </Link>
  </li>
)

interface IProps {
  filters: string[]
  current: string
}

export default function FilterMenu({ filters, current }: IProps) {
  return (
    <ul className="filters">
      {filters.map((filter) => (
        <FilterLink key={filter} active={current === filter} filter={filter} />
      ))}
    </ul>
  )
}
