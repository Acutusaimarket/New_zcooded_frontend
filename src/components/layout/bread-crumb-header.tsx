import React, { Fragment, useMemo } from "react";

import { Link, useLocation } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbPath {
  label: string;
  path: string;
  isLast: boolean;
}

const BreadcrumbHeader: React.FC<{
  paths?: BreadcrumbPath[];
}> = ({ paths }) => {
  const location = useLocation();

  const pathnameWithLabel = useMemo(
    () =>
      paths && paths?.length > 0
        ? paths
        : location.pathname
            .split("/")
            .filter(Boolean)
            .map((segment, index, array) => {
              return {
                label:
                  segment.charAt(0).toUpperCase() +
                  segment.slice(1).replace(/-/g, " "),
                path: "/" + array.slice(0, index + 1).join("/"),
                isLast: index === array.length - 1,
              };
            }),
    [location.pathname, paths]
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {location.pathname !== "/" &&
          pathnameWithLabel.map(({ label, path, isLast }) => {
            if (isLast) {
              return (
                <BreadcrumbItem key={path}>
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            }

            return (
              <Fragment key={path}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={path}>{label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbHeader;
