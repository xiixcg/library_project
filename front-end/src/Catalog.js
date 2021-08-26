import { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid"

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
const Catalog = ({isLibrarian}) => {
  const [books, setBooks] = useState([])
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
  }, [])

  return (
    <div>
      <DataGrid
        rows={books}
        columns={columns}
        autoPageSize={true}
        autoHeight={true}
        rowsPerPageOptions={[20]}
        disableColumnMenu={true}
      />
    </div>
  )
}

export default Catalog;