CREATE OR replace PACKAGE sdo_lrs
AS
  FUNCTION clip_geom(
    p_lrs_line      IN mdsys.sdo_geometry,
    p_current_start IN NUMBER,
    p_window_start  IN NUMBER,
    p_tolerance     IN NUMBER DEFAULT 0.005,
    p_unit          IN VARCHAR2 DEFAULT NULL,
    p_exception     IN PLS_INTEGER DEFAULT 0)
  RETURN mdsys.sdo_geometry deterministic;

  FUNCTION get_measure(
    p_start IN mdsys.sdo_geometry,
    p_end   IN mdsys.sdo_geometry)
  RETURN NUMBER deterministic;

  FUNCTION locate_point(
    p_geometry  IN mdsys.sdo_geometry,
    p_fraction  IN NUMBER,
    p_tolerance IN NUMBER DEFAULT 0.005,
    p_unit      IN VARCHAR2 DEFAULT NULL,
    p_exception IN PLS_INTEGER DEFAULT 0)
  RETURN mdsys.sdo_geometry deterministic;

  FUNCTION project_pt(
    geom_segment IN SDO_GEOMETRY,
    point        IN SDO_GEOMETRY,
    tolerance    IN NUMBER DEFAULT 1.0e-8,
    unit         IN VARCHAR2 DEFAULT NULL
  /* NO OFFSET AS IS FUNCTION */ )
  RETURN mdsys.sdo_geometry deterministic;

END sdo_lrs;
