import {useExpanded, useGroupBy, useSortBy, useTable} from "react-table";
import React, {useEffect, useState} from "react";
import {chakra, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import EditableCell from "./editable-cell";
import useKeyPress from "./use-key-press";

const defaultColumn = {
  Cell: EditableCell,
}

const useIsSelected = function(cell, selectedCell) {
  return cell.column.id === selectedCell.columnId &&
      cell.row.index === selectedCell.rowIndex;
}

const useIsSelectedReadOnly = function(cell, selectedCell) {
  return useIsSelected(cell, selectedCell) && selectedCell.isReadOnly;
}

export function DataTable({columns, data, updateMyData, skipPageReset}) {

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

  const [selectedCell, setSelected] = useState(
      {rowIndex: 0, columnId: "date"});

  const [isReadOnlyRows, setRows] = useState(
      rows.map(() => true))

  const setReadOnlyForRow = (rowIndex, isReadOnly, rows) => {
    const newRows = [...rows]
    newRows[rowIndex] = isReadOnly
    return newRows
  }

  const updateBetterNameForThis = (selectedRowIndex, isReadOnly, rows) => {
    const readOnlyForRow = setReadOnlyForRow(
        selectedRowIndex,
        isReadOnly,
        rows);
    setRows(readOnlyForRow)
  }

  const downPress = useKeyPress("ArrowDown");
  useEffect(() => {
    if (selectedCell.rowIndex < rows.length - 1 && downPress) {

      const selectedCellRowIndex = selectedCell.rowIndex
      updateBetterNameForThis(selectedCellRowIndex, true, isReadOnlyRows)

      setSelected(prevState => {
        return {
          rowIndex: prevState.rowIndex + 1,
          columnId: prevState.columnId
        }
      })
    }
  }, [downPress]);

  const upPress = useKeyPress("ArrowUp");
  useEffect(() => {
    if (selectedCell.rowIndex > 0 && upPress) {

      const selectedCellRowIndex = selectedCell.rowIndex
      updateBetterNameForThis(selectedCellRowIndex, true, isReadOnlyRows)

      setSelected(prevState => {
        return {
          rowIndex: prevState.rowIndex - 1,
          columnId: prevState.columnId
        }
      })
    }
  }, [upPress]);

  const rightPress = useKeyPress("ArrowRight");
  useEffect(() => {
    let tableColumns = headerGroups[0].headers.map(header => header.id)

    const selectedColumnIndex = tableColumns.indexOf(selectedCell.columnId)
    const canMoveRight = selectedColumnIndex < tableColumns.length - 1
    if (canMoveRight && rightPress) {
      setSelected(prevState => {
        return {
          rowIndex: prevState.rowIndex,
          columnId: tableColumns[selectedColumnIndex + 1]
        }
      })
    }
  }, [rightPress]);

  const leftPress = useKeyPress("ArrowLeft");
  useEffect(() => {
    let tableColumns = headerGroups[0].headers.map(header => header.id)

    const selectedColumnIndex = tableColumns.indexOf(selectedCell.columnId)
    const canMoveLeft = selectedColumnIndex > 0
    if (canMoveLeft && leftPress) {
      setSelected(prevState => {
        return {
          rowIndex: prevState.rowIndex,
          columnId: tableColumns[selectedColumnIndex - 1]
        }
      })
    }
  }, [leftPress]);

  const enterPress = useKeyPress("Enter");
  useEffect(() => {

    if (enterPress) {

      const selectedCellRowIndex = selectedCell.rowIndex
      updateBetterNameForThis(selectedCellRowIndex, !isReadOnlyRows[selectedCellRowIndex], isReadOnlyRows)
      const elementId = `${selectedCell.rowIndex+selectedCell.columnId}`;
      const selectedElement = document.getElementById(elementId);
      selectedElement.focus()
      selectedElement.select()
    }
  }, [enterPress]);

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
                          backgroundColor={useIsSelected(cell, selectedCell)
                              ? "gray.100" : ""}
                          onClick={() => setSelected({
                            rowIndex: cell.row.index,
                            columnId: cell.column.id,
                          })}
                      >
                        {cell.render("Cell", {
                          isReadOnly: isReadOnlyRows[row.index],
                          inputId: `${cell.row.index+cell.column.id}`
                        })}
                      </Td>
                  ))}
                </Tr>
            )
          })}
        </Tbody>
        <p>{JSON.stringify(isReadOnlyRows)}</p>
        <p>{JSON.stringify(selectedCell)}</p>
      </Table>
  );

}
