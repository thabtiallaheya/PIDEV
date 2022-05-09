import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Button} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import Badge from "@material-ui/core/Badge";

// components
import Iconify from '../../components/Iconify';
//

import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbarStudent.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbarStudent(props,{ onOpenSidebar }) {
  const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
         {/**  <Button color="secondary"  component={RouterLink} to={`/carts`} class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeLarge css-hpqcig-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button">
            <span class="MuiBadge-root css-1c32n2y-MuiBadge-root">
            {<ShoppingCartIcon />}</span>
             <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root">{props.itemCount}</span></Button> */}
        
             <Badge  component={RouterLink} to={`/carts`} class="MuiBadge-root css-1c32n2y-MuiBadge-root"  tabindex="0" type="button" color="secondary" badgeContent={props.itemCount}>
          <ShoppingCartIcon />{" "}
        </Badge>
             
            
             
          <Button component={RouterLink} to={`/chat`} class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeLarge css-hpqcig-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button">
            <span class="MuiBadge-root css-1c32n2y-MuiBadge-root">
            {<ChatIcon />} </span>
             <span class="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root"></span></Button>
        
        
  
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
