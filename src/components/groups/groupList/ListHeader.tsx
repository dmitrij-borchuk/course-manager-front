import { FormattedMessage } from 'react-intl'
import ArchiveIcon from '@mui/icons-material/Archive'
import { ResponsiveButtons } from 'components/kit/responsiveButtons/ResponsiveButtons'
import { SectionHeader } from 'components/kit/sectionHeader/SectionHeader'

type Props = {
  onFilterClick: () => void
}
export function Heading({ onFilterClick }: Props) {
  return (
    <div className="flex w-full items-center mt-6 justify-between">
      <SectionHeader>
        <FormattedMessage id="groups.list.title" />
      </SectionHeader>

      <ResponsiveButtons
        items={[
          {
            id: 'edit',
            label: <FormattedMessage id="common.filter" />,
            icon: <ArchiveIcon />,
            onClick: onFilterClick,
          },
        ]}
      />
    </div>
  )
}
