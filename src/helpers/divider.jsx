import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import GridOnIcon from '@mui/icons-material/GridOn';
import Divider from '@mui/material/Divider';

export default function InsetDividers(props) {
  return (
    
    <List
      sx={{
        width: props.width,
        height:props.height,
        //maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'fixed',
      zIndex: 1,
 
        backgroundColor: 'rgba(255, 255, 255, )', // Fondo blanco con opacidad 0.5
     
      }}
    >
      <ListItem >
        <ListItemAvatar  >
          <Avatar sx={{color:props.color1}}>
            <GridOnIcon  />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.texto1} secondary={props.texto4}  />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar sx={{color:props.color2}}>
          <Avatar sx={{color:props.color2}}>
            <GridOnIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.texto2}secondary={props.texto5} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{color:props.color3}}>
        <ListItemAvatar >
          <Avatar sx={{color:props.color3}}>
            <GridOnIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.texto3} secondary={props.texto6}/>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{color:props.color4}}>
        <ListItemAvatar >
          <Avatar sx={{color:props.color4}}>
            <GridOnIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.texto7} secondary={props.texto8}/>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{color:props.color5}}>
        <ListItemAvatar >
          <Avatar sx={{color:props.color5}}>
            <GridOnIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.texto8} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{color:props.color6}}>
        <ListItemAvatar >
          <Avatar sx={{color:props.color6}}>
            <GridOnIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={props.texto9} />
      </ListItem>
    </List>
  );
}
