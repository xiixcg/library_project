import {useState, useEffect} from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const rand = () => {
  return Math.round(Math.random() * 20) - 10;
}

const getModalStyle = () => {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Book = ({ bookId }) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [book, setBook] = useState({});
  const [userId, setUserId] = useState('');
  const [checkedOutStatus, setCheckedOutStatus] = useState('');
  useEffect(() => {
    fetch(`http://localhost:3030/api/books/${bookId}`)
      .then(res => {
        if (res.ok) 
          return res.json()
        else
          throw res;
      })
      .then(data => (
        setBook(data)
      ))
      .catch(err => console.log(err))
  }, [bookId])

  const checkCheckoutStatus = (event) => {
    event.preventDefault();
    console.log("checking checkout status")
    fetch(`http://localhost:3030/api/books/${bookId}/checkout/${userId}`)
      .then(res => {
        if (res.ok)
          return res.json();
        else
          throw res;
      })
      .then(data => {
        if(data.checkedOut) {
          setCheckedOutStatus(data.message);
        } else {
          //second fetch
          attemptCheckout()
        }
      })
      .catch(err => console.log(err))
  }

  const attemptCheckout = () => {
    console.log("attempt checkout");

    fetch(`http://localhost:3030/api/books/${bookId}/checkout/${userId}`, {
      method: 'PATCH'
    })
      .then(res => {if(res.ok) {return res.json()} else throw res})
      .then(data => {
        setUserId('')
        setCheckedOutStatus("Book successfully checked out!")
      })
  }

  return (
    <div style={modalStyle} className={classes.paper}>
      <h2>{book.book_title}</h2>
      <h3>{book.author}</h3>
      <h3>{book.isbn}</h3>
      <p>
       {checkedOutStatus}
      </p>

      <form onSubmit={checkCheckoutStatus}>
        <TextField value={userId} label="User ID" onChange={(event) => {setUserId(event.target.value)}}/>
        <Button type='submit' variant="contained" color="primary" disabled={userId === ''}>
          Check Out
        </Button>
      </form>
    </div>
  )
}

export default Book