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

  /**
  * Snap Point to Line
  */
  FUNCTION snap(
    p_geometry  IN mdsys.sdo_geometry,
    p_point     IN mdsys.sdo_geometry,
    p_tolerance IN NUMBER DEFAULT 0.005,
    p_unit      IN VARCHAR2 DEFAULT NULL,
    p_exception IN PLS_INTEGER DEFAULT 0)
  RETURN mdsys.sdo_geometry;

  PROCEDURE split(
    p_geometry  IN mdsys.sdo_geometry,
    p_point     IN mdsys.sdo_geometry,
    p_tolerance IN NUMBER DEFAULT 0.005,
    p_out_geom1 OUT nocopy mdsys.sdo_geometry,
    p_out_geom2 OUT nocopy mdsys.sdo_geometry,
    p_snap      IN PLS_INTEGER DEFAULT 0,
    p_unit      IN VARCHAR2 DEFAULT NULL,
    p_exception IN PLS_INTEGER DEFAULT 0);

END sdo_lrs;
