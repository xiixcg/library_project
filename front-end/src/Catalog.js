import { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid"
import Modal from '@material-ui/core/Modal';
import Book from './Book.js'
import { Button } from "@material-ui/core";


const columns = [
  {
    field: 'book_title',
    headerName: 'Book',
    flex: 1,
    minWidth: 200
  },
  {
    field: 'author',
    headerName: 'Author',
    flex: 1,
    minWidth: 200
  },
  {
    field: 'isbn',
    headerName: 'ISBN',
    width: 125
  },
  {
    field: 'checked_out_to',
    headerName: 'Checked Out To',
    width: 135,
    sortable: false
  },
]
const Catalog = ({ isLibrarian }) => {
  const [books, setBooks] = useState([])
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [bookModalOpen, setBookModalOpen] = useState(false)
  useEffect(() => {
    fetch(`http://localhost:3030/api/books`)
      .then(res => {
        if(res.ok)
          return res.json()
        else
          throw res;
      })
      .then(data => {
        setBooks(data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [bookModalOpen, books])

  const handleBookModalOpen = (event) => {
    if(selectedBookIds.length === 0)
      setBookModalOpen(true);
  }

  const handleBookModalClose = () => {
    setBookModalOpen(false);
    setSelectedBookIds([]);
  }

  const returnBooks = (event) => {
    let allPromise = selectedBookIds.map(bookId => {
      return (
        fetch(`http://localhost:3030/api/books/${bookId}/return`, {
          method: 'PATCH'
        }).then(res => {
          if(res.ok) {return res.json()} else throw res
        })
      )
    })
    Promise.all(allPromise).then(res => {
      console.log("Succesful returns")
      setBooks([])
      setSelectedBookIds([]);
    })
      .catch(err => console.log(err))
  }

  const LibrarianReturn = () => {
    if(isLibrarian) {
      return (
        <Button disabled={selectedBookIds.length === 0} 
          variant="contained" 
          color="secondary"
          onClick={returnBooks}>
          Return Books
        </Button>
      )
    } else {
      return null;
    }
  }

  return (
    <div>
      <LibrarianReturn />
      <DataGrid
        rows={books}
        columns={columns}
        autoPageSize={true}
        autoHeight={true}
        checkboxSelection={isLibrarian}
        rowsPerPageOptions={[20]}
        disableColumnMenu={true}
        onSelectionModelChange={newSelectedRows => setSelectedBookIds(newSelectedRows)}
        selectionModel={selectedBookIds}
        onRowClick={event => (handleBookModalOpen(event))}
      />
      <Modal
        open={bookModalOpen}
        onClose={handleBookModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Book bookId={selectedBookIds[0]}/>
      </Modal>
    </div>
  )
}

export default Catalog;