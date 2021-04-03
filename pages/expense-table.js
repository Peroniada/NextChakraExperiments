import React, {useState} from "react";
import {useExpanded, useGroupBy, useSortBy, useTable} from "react-table";
import {
  chakra,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react"
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons"

function initialData() {
  return [
    {
      date: "20.02.2021",
      name: "chicken",
      category: "food",
      price: 12,
      notes: "Lorem Slorem",
    },
    {
      date: "23.02.2021",
      name: "bread",
      category: "food",
      price: 12,
      notes: "Lorem Slorem",
    },
    {
      date: "24.02.2021",
      name: "vitamins",
      category: "health",
      price: 40,
      notes: "Lorem Slorem",
    },
    {
      date: "24.02.2021",
      name: "therapy",
      category: "health",
      price: 150,
      notes: "Lorem Slorem",
    },
    {
      date: "25.02.2021",
      name: "taxi",
      category: "transport",
      price: 24,
      notes: "Lorem Slorem",
    },
    {
      date: "26.02.2021",
      name: "whisky",
      category: "alcohol",
      price: 120,
      notes: "Lorem Slorem",
    },
    {
      date: "27.02.2021",
      name: "rum",
      category: "alcohol",
      price: 60,
      notes: "Lorem Slorem",
    },
    {
      date: "28.02.2021",
      name: "chicken",
      category: "food",
      price: 12,
      notes: "Lorem Slorem",
    },
  ];
}

const EditableCell = ({
  value: initialValue,
  row: {index},
  column: {id},
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)
  const [isReadOnly, setReadOnly] = useState(true);

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
    setReadOnly(true)
  }

  const makeEditable = (event) => {
    event.preventDefault()
    setReadOnly(false)
  }


  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <Input
      isReadOnly={isReadOnly}
      onDoubleClick={makeEditable}
      onTouchStart={makeEditable}
      value={value}
      border={"none"}
      onChange={onChange}
      onBlur={onBlur}/>
}

const defaultColumn = {
  Cell: EditableCell,
}

function DataTable({columns, data, updateMyData, skipPageReset}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: {groupBy, expanded},
  } = useTable(
      {columns, data, defaultColumn, updateMyData},
      useGroupBy,
      useSortBy,
      useExpanded,
  )

  return (
      <Table
          mt={"20vh"}
          width={"60%"}
          {...getTableProps()}
      >
        <Thead>
          {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                    <Th
                        {...column.getHeaderProps(
                            column.getSortByToggleProps())}
                        isNumeric={column.isNumeric}
                    >
                      {column.render("Header")}
                      <chakra.span pl="4">
                        {column.isSorted ? (
                            column.isSortedDesc ? (
                                <TriangleDownIcon
                                    aria-label="sorted descending"/>
                            ) : (
                                <TriangleUpIcon
                                    aria-label="sorted ascending"/>
                            )
                        ) : null}
                      </chakra.span>
                    </Th>
                ))}
              </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                      <Td {...cell.getCellProps()}
                          isNumeric={cell.column.isNumeric}
                          padding={`0`}
                      >
                        {cell.render("Cell")}
                      </Td>
                  ))}
                </Tr>
            )
          })}
        </Tbody>
      </Table>
  );
}

export default function ExpenseTable() {

  const [data, setData] = React.useState(() => initialData())
  const [skipPageReset, setSkipPageReset] = React.useState(false)
  const columns = React.useMemo(
      () => [
        {
          Header: "Date",
          accessor: "date",
        },
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Category",
          accessor: "category",
        },
        {
          Header: "Price",
          accessor: "price",
          isNumeric: true,
        },
        {
          Header: "Notes",
          accessor: "notes"
        }

      ],
      [],
  )

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            }
          }
          return row
        })
    )
  }

  return (
      <Flex
          justifyContent={"center"}
      >
        <DataTable
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
        />
      </Flex>
  )

}