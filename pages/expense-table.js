import React, {useEffect, useState} from "react";
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
  // const [isSelected, setSelected] = useState(false);

  const onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
    setReadOnly(true)
    // setSelected(false)
  }

  const makeEditable = (event) => {
    event.preventDefault()
    setReadOnly(false)
  }

  // const selectCell = () => {
  //   setSelected(true)
  // }


  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <Input
      // backgroundColor={isSelected ? "gray.100" : "none"}
      isReadOnly={isReadOnly}
      onDoubleClick={makeEditable}
      onTouchStart={makeEditable}
      // onClick={selectCell}
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

  const [selectedCell, setSelected] = useState({rowIndex: 0, columnId: "date"});

  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const enterPress = useKeyPress("Enter");

  useEffect(() => {
    if (selectedCell.rowIndex < rows.length-1 && downPress) {
      setSelected(prevState => {
        return {columnId: prevState.columnId, rowIndex: prevState.rowIndex + 1}
      })
    }
  }, [downPress]);

  useEffect(() => {
    if (selectedCell.rowIndex > 0 && upPress) {
      setSelected(prevState => {
        return {columnId: prevState.columnId, rowIndex: prevState.rowIndex - 1}
      })
    }
  }, [upPress]);

  useEffect(() => {
    let tableColumns = headerGroups[0].headers.map(header => header.id)

    const selectedColumnIndex = tableColumns.indexOf(selectedCell.columnId)
    const canMoveRight = selectedColumnIndex < tableColumns.length - 1
    if (canMoveRight && rightPress) {
      setSelected(prevState => {
        return {columnId: tableColumns[selectedColumnIndex + 1], rowIndex: prevState.rowIndex}
      })
    }
  }, [rightPress]);

  useEffect(() => {
    let tableColumns = headerGroups[0].headers.map(header => header.id)

    const selectedColumnIndex = tableColumns.indexOf(selectedCell.columnId)
    const canMoveLeft = selectedColumnIndex > 0
    if (canMoveLeft && leftPress) {
      setSelected(prevState => {
        return {columnId: tableColumns[selectedColumnIndex - 1], rowIndex: prevState.rowIndex}
      })
    }
  }, [leftPress]);

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
                          backgroundColor={useIsSelected(cell, selectedCell)? "gray.100": ""}
                          onClick={() => setSelected({rowIndex: cell.row.index, columnId: cell.column.id})}
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

const useKeyPress = function(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

const useIsSelected = function(cell, selectedCell) {
  return cell.column.id === selectedCell.columnId &&
      cell.row.index === selectedCell.rowIndex;
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