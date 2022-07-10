import { Avatar, ListItem, styled, Typography } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import { Language, LinkedIn, Mail, Phone } from '@mui/icons-material'
import { useRouter } from 'next/router'

interface ContactProps {
  name: string
  avatar: string
  job: string
  phone: string
  mail: string
  teams: string
  linkedIn: string
  www: string
}

const contactList: ContactProps[] = [
  {
    name: 'Jonas Großeheide, M.Sc.',
    avatar: 'img/contacts/contactsJonas.png',
    job: 'Research Associate',
    phone: '0241 80 25466',
    mail: 'j.grosseheide@wzl.rwth-aachen.de',
    teams: 'hzss3nqwn9qw876s@m365.rwth-aachen.d',
    linkedIn: 'jonas-großeheide/',
    www: 'https://www.wzl.rwth-aachen.de/go/id/siic/gguid/0x05EA87834B51DD48BB734D758EC70F7A',
  },
  {
    name: 'Kilian Geiger, M.Sc.',
    avatar: 'img/contacts/contactsKilian.png',
    job: 'Research Associate',
    phone: '0241 80 20220',
    mail: 'k.geiger@wzl.rwth-aachen.de',
    teams: 'wsa5dr6ewn4jyuz9@m365.rwth-aachen.de',
    linkedIn: 'kilian-geiger-b3a18821a/',
    www: 'https://www.wzl.rwth-aachen.de/go/id/siic/gguid/0x8E927324E1EE7840ABB284BFF13914A4',
  },
]

const CustomerListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
}))

const CustomerAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  border: '3px solid white',
}))

const CustomerGrid = styled(Grid)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  marginTop: '0.5rem',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  paddingBottom: '0',
}))

const Contact: React.FC<ContactProps> = (props) => {
  const router = useRouter()
  const { basePath } = router
  return (
    <Box sx={{ width: 480 }}>
      <CustomerListItem>
        <CustomerAvatar src={`${basePath}/${props.avatar}`} />
        <Typography>
          <b>{props.name}</b>
        </Typography>
        <Typography>{props.job}</Typography>
        <Typography>
          <Phone sx={{ fontSize: '1rem' }} /> {props.phone} <br />
          <Mail sx={{ fontSize: '1rem' }} />
          <a href={`mailto:${props.mail}`}>
            &nbsp;{props.mail.split('@')[0]}
            <br />
            <Mail sx={{ fontSize: '1rem' }} style={{ color: '#FFFFFF' }} />@
            {props.mail.split('@')[1]}
          </a>
          <div>
            <SvgIcon>
              <path d="M19.19 8.77Q18.73 8.77 18.33 8.6 17.94 8.43 17.64 8.13 17.34 7.83 17.17 7.44 17 7.04 17 6.58 17 6.13 17.17 5.73 17.34 5.33 17.64 5.04 17.94 4.74 18.33 4.57 18.73 4.39 19.19 4.4 19.64 4.39 20.04 4.57 20.44 4.74 20.74 5.04 21.03 5.33 21.21 5.73 21.38 6.13 21.38 6.58 21.38 7.04 21.21 7.44 21.04 7.83 20.74 8.13 20.44 8.43 20.04 8.6 19.64 8.77 19.19 8.77M19.19 5.65Q18.8 5.65 18.5 5.92 18.25 6.19 18.25 6.58 18.25 6.97 18.5 7.25 18.8 7.5 19.19 7.5 19.58 7.5 19.85 7.25 20.13 7 20.13 6.58 20.13 6.19 19.85 5.92 19.58 5.65 19.19 5.65M22 10.33V15Q22 15.63 21.76 16.2 21.5 16.77 21.09 17.19 20.66 17.62 20.09 17.86 19.5 18.11 18.88 18.11 18.5 18.11 18.12 18 17.73 17.93 17.41 17.75 17.17 18.54 16.7 19.19 16.23 19.84 15.6 20.3 14.97 20.76 14.21 21 13.45 21.27 12.63 21.27 11.67 21.27 10.82 20.94 10 20.61 9.32 20 8.66 19.43 8.23 18.64 7.79 17.84 7.66 16.9H2.83Q2.5 16.9 2.24 16.65 2 16.41 2 16.07V7.73Q2 7.39 2.24 7.14 2.5 6.9 2.83 6.9H10Q9.71 6.3 9.71 5.65 9.71 5.04 9.94 4.5 10.16 4 10.56 3.58 10.96 3.19 11.5 2.96 12 2.73 12.62 2.73 13.23 2.73 13.76 2.96 14.29 3.19 14.69 3.58 15.09 4 15.31 4.5 15.54 5.04 15.54 5.65 15.54 6.25 15.31 6.79 15.09 7.32 14.69 7.71 14.29 8.11 13.76 8.34 13.23 8.57 12.62 8.57 12.47 8.57 12.31 8.55 12.16 8.53 12 8.5V9.4H21.06Q21.45 9.4 21.73 9.67 22 9.94 22 10.33M12.63 4Q12.28 4 12 4.11 11.67 4.24 11.44 4.47 11.22 4.7 11.09 5 10.96 5.31 10.96 5.65 10.96 6 11.09 6.3 11.22 6.6 11.44 6.83 11.67 7.05 12 7.19 12.28 7.32 12.63 7.32 12.97 7.32 13.27 7.19 13.57 7.05 13.8 6.83 14.03 6.6 14.16 6.3 14.3 6 14.3 5.65 14.3 5.31 14.16 5 14.03 4.7 13.8 4.47 13.57 4.24 13.27 4.11 12.97 4 12.63 4M7.78 10.18H9.66V8.62H4.34V10.18H6.22V15.18H7.78M16.38 16.27V10.65H12V16.07Q12 16.41 11.76 16.65 11.5 16.9 11.17 16.9H8.92Q9.05 17.57 9.39 18.15 9.73 18.72 10.21 19.14 10.69 19.55 11.31 19.79 11.92 20 12.63 20 13.4 20 14.08 19.73 14.76 19.43 15.28 18.92 15.79 18.41 16.08 17.73 16.38 17.05 16.38 16.27M20.75 15V10.65H17.63V16.36Q17.88 16.61 18.2 16.74 18.5 16.86 18.88 16.86 19.27 16.86 19.61 16.71 19.95 16.56 20.2 16.31 20.46 16.06 20.6 15.71 20.75 15.37 20.75 15Z" />
            </SvgIcon>
            <a
              href={`https://teams.microsoft.com/l/chat/0/0/?users=${props.teams}`}
              style={{ color: '#00549F', textDecoration: 'none' }}
            >
              Livechat via Teams
            </a>
          </div>
        </Typography>
        <CustomerGrid>
          <Grid item>
            <IconButton href={`https://www.linkedin.com/in/${props.linkedIn}`}>
              <LinkedIn style={{ color: '#00549F' }} />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton href={props.www}>
              <Language style={{ color: '#00549F' }} />
            </IconButton>
          </Grid>
        </CustomerGrid>
      </CustomerListItem>
    </Box>
  )
}

const CustomerDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}))

interface ContactUsProps {
  visible: boolean
  onClose(): void
}

const ContactUs: React.FC<ContactUsProps> = ({ visible, onClose }) => {
  return (
    <CustomerDrawer anchor="right" open={visible} onClose={onClose}>
      {contactList.map((item) => (
        <Contact key={item.name} {...item} />
      ))}
    </CustomerDrawer>
  )
}

export default ContactUs
