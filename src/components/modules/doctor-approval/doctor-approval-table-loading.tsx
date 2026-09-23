import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

const DoctorApprovalTableLoading = () => {
     const skeletonCells = [
    "cell-1",
    "cell-2",
    "cell-3",
    "cell-4",
    "cell-5",
    "cell-6",
    "cell-7",
    "cell-8",
  ];
  return (
    <>
      {[1, 2, 3, 4, 5].map((row) => (
        <TableRow key={row}>
          {skeletonCells.map((cell) => (
            <TableCell key={cell}>
              <Skeleton className="h-4 w-24" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default DoctorApprovalTableLoading;
