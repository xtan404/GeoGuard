// ** Icon imports
import ViewDashboardOutline from 'mdi-material-ui/ViewDashboardOutline'
import AlertOutline from 'mdi-material-ui/AlertOutline'
import FileOutline from 'mdi-material-ui/FileOutline'
import FaceAgent from 'mdi-material-ui/FaceAgent'
import Logout from 'mdi-material-ui/Logout'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: ViewDashboardOutline,
      path: '/admin/orders'
    },
    {
      title: 'Alert Management',
      icon: AlertOutline,
      path: '/admin/geo/alerts'
    },
    {
      title: 'Reports',
      icon: FileOutline,
      path: '/admin/geo/reports'
    },
    {
      title: 'Help and Support',
      icon: FaceAgent,
      path: '/admin/geo/support'
    },
    {
      title: 'Logout',
      icon: Logout,
      path: '/admin/services'
    },
  ]
}

export default navigation
