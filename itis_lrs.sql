DEFINE INSTALL_SCHEMA='&1'

SET VERIFY OFF;
CREATE OR REPLACE PACKAGE itis_lrs AUTHID DEFINER
AS
FUNCTION find_lrs_dim_pos(lrs_geometry IN MDSYS.SDO_GEOMETRY,
                          tolerance    IN NUMBER DEFAULT 0.005)
  RETURN INTEGER DETERMINISTIC;
FUNCTION find_lrs_dim_pos(table_name  IN VARCHAR2,
                          column_name IN VARCHAR2)
  RETURN INTEGER DETERMINISTIC;
FUNCTION concatenate_geom_segments(geom_segment_1 IN MDSYS.SDO_GEOMETRY,
                                   geom_segment_2 IN MDSYS.SDO_GEOMETRY,
                                   tolerance      IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION split_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                            split_measure IN NUMBER,
                            tolerance     IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY_array pipelined;
PROCEDURE split_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                             split_measure IN NUMBER,
                             segment_1 OUT MDSYS.SDO_GEOMETRY,
                             segment_2 OUT MDSYS.SDO_GEOMETRY,
                             tolerance   IN NUMBER DEFAULT 0.005);
FUNCTION clip_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                           start_measure IN NUMBER,
                           end_measure   IN NUMBER,
                           tolerance     IN NUMBER DEFAULT 0.005,
                           unit          IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION dynamic_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                         start_measure IN NUMBER,
                         end_measure   IN NUMBER,
                         tolerance     IN NUMBER DEFAULT 0.005,
                         unit          IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION locate_pt(geom_segment IN MDSYS.SDO_GEOMETRY,
                   measure      IN NUMBER DEFAULT 0,
                   offset       IN NUMBER DEFAULT 0,
                   tolerance    IN NUMBER DEFAULT 0.005,
                   unit         IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION find_offset (geom_segment IN MDSYS.SDO_GEOMETRY,
                      point        IN MDSYS.SDO_GEOMETRY,
                      tolerance    IN NUMBER DEFAULT 0.005,
                      unit         IN VARCHAR2 DEFAULT NULL)
  RETURN NUMBER DETERMINISTIC;
FUNCTION find_measure(lrs_segment IN MDSYS.SDO_GEOMETRY,
                      point       IN MDSYS.SDO_GEOMETRY,
                      tolerance   IN NUMBER DEFAULT 0.005,
                      unit        IN VARCHAR2 DEFAULT NULL)
  RETURN NUMBER DETERMINISTIC;
FUNCTION get_measure(point IN MDSYS.SDO_GEOMETRY)
  RETURN NUMBER DETERMINISTIC;
FUNCTION project_pt (geom_segment IN MDSYS.SDO_GEOMETRY,
                     point        IN MDSYS.SDO_GEOMETRY,
                     tolerance    IN NUMBER DEFAULT 0.005,
                     unit         IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION lrs_intersection(geom_1    IN MDSYS.SDO_GEOMETRY,
                          geom_2    IN MDSYS.SDO_GEOMETRY,
                          tolerance IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION reverse_measure (lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION reverse_geometry (geom_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
  /* Populates the measures of all shape points based on the start and end measures of a geometric segment, overriding any previously assigned measures between the start point and end point.*/
FUNCTION redefine_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                               start_measure IN NUMBER,
                               end_measure   IN NUMBER)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
PROCEDURE redefine_geom_segment(geom_segment  IN OUT MDSYS.SDO_GEOMETRY,
                                start_measure IN NUMBER,
                                end_measure   IN NUMBER);
PROCEDURE reset_measure(lrs_segment           IN OUT MDSYS.SDO_GEOMETRY);
FUNCTION reset_measure(lrs_segment            IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION is_measure_increasing (lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION is_measure_decreasing (lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION translate_measure(geom_segment IN MDSYS.SDO_GEOMETRY,
                           translate_m  IN NUMBER)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION measure_to_percentage(lrs_segment IN MDSYS.SDO_GEOMETRY,
                               measure     IN NUMBER)
  RETURN NUMBER DETERMINISTIC;
FUNCTION percentage_to_measure(lrs_segment IN MDSYS.SDO_GEOMETRY,
                               percentage  IN NUMBER)
  RETURN NUMBER DETERMINISTIC;
FUNCTION convert_to_std_geom(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION convert_to_lrs_geom(standard_geom IN MDSYS.SDO_GEOMETRY,
                             start_measure IN NUMBER DEFAULT NULL,
                             end_measure   IN NUMBER DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
  /**
  * The start and end measures of geom_segment must be defined (cannot be null),
  * and any measures assigned must be in an ascending or descending order along the segment direction.
  **/
FUNCTION is_geom_segment_defined(geom_segment IN MDSYS.SDO_GEOMETRY,
                                 dim_array    IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 DETERMINISTIC;
  /**
  * Description
  *  Returns the measure range of a geometric segment, that is, the difference between the start measure and end measure.
  **/
FUNCTION measure_range(lrs_segment IN MDSYS.SDO_GEOMETRY,
                       dim_array   IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN NUMBER DETERMINISTIC;
FUNCTION set_pt_measure(lrs_segment IN MDSYS.SDO_GEOMETRY,
                        point       IN MDSYS.SDO_GEOMETRY,
                        measure     IN NUMBER,
                        tolerance   IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION scale_geom_segment(lrs_segment   IN MDSYS.SDO_GEOMETRY,
                            start_measure IN NUMBER,
                            end_measure   IN NUMBER,
                            shift_measure IN NUMBER,
                            tolerance     IN NUMBER DEFAULT 0.005 )
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION geom_segment_end_measure(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN NUMBER DETERMINISTIC;
FUNCTION geom_segment_start_measure(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN NUMBER DETERMINISTIC;
FUNCTION geom_segment_start_pt(geom_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION geom_segment_end_pt(geom_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION is_shape_pt_measure(geom_segment IN MDSYS.SDO_GEOMETRY,
                             measure      IN NUMBER)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION geom_segment_length(geom_segment IN MDSYS.SDO_GEOMETRY,
                             unit         IN VARCHAR2 DEFAULT NULL)
  RETURN NUMBER DETERMINISTIC;
FUNCTION offset_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                             start_measure IN NUMBER,
                             end_measure   IN NUMBER,
                             offset        IN NUMBER DEFAULT 0,
                             tolerance     IN NUMBER DEFAULT 0.005,
                             unit          IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
FUNCTION valid_geom_segment(geom_segment IN MDSYS.SDO_GEOMETRY,
                            dim_array    IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION valid_lrs_pt(point     IN MDSYS.SDO_GEOMETRY,
                      dim_array IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION valid_measure(geom_segment IN MDSYS.SDO_GEOMETRY,
                       measure      IN NUMBER)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION validate_lrs_geometry(geom_segment IN MDSYS.SDO_GEOMETRY,
                               dim_array    IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 DETERMINISTIC;
FUNCTION round_coordinates(geom_segment   IN MDSYS.SDO_GEOMETRY,
                           p_x_dec_places IN INTEGER DEFAULT NULL,
                           p_y_dec_places IN INTEGER DEFAULT NULL,
                           p_z_dec_places IN INTEGER DEFAULT NULL,
                           p_w_dec_places IN INTEGER DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY DETERMINISTIC;
  /*
TOBEDONE:
--------
CONNECTED_GEOM_SEGMENTS
GET_NEXT_SHAPE_PT
GET_NEXT_SHAPE_PT_MEASURE
GET_PREV_SHAPE_PT
GET_PREV_SHAPE_PT_MEASURE
*/
END itis_lrs;
/
SHOW ERRORS
CREATE OR replace PACKAGE BODY itis_lrs
AS
FUNCTION find_lrs_dim_pos(lrs_geometry IN MDSYS.SDO_GEOMETRY,
                          tolerance    IN NUMBER DEFAULT 0.005)
  RETURN INTEGER AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_geometry,nvl(tolerance,0.005)) .st_lrs_dim();
  END find_lrs_dim_pos;
FUNCTION find_lrs_dim_pos(table_name  IN VARCHAR2,
                          column_name IN VARCHAR2)
  RETURN INTEGER AS v_schema VARCHAR2(30) :=
  CASE
  WHEN instr(table_name,'.')=0 THEN
    sys_context('USERENV','SESSION_USER')
  ELSE
    substr(table_name,1,instr(table_name,'.')-1)
  END;
  v_table_name VARCHAR2(30) :=
  CASE
  WHEN v_schema IS NULL THEN
    table_name
  ELSE
    substr(table_name,instr(table_name,'.')+1,30)
  END;
  v_dim_array MDSYS.SDO_DIM_ARRAY;
  BEGIN
    -- dbms_output.put_line(NVL(v_schema,'NULL')||','||NVL(v_table_name,'NULL')||','||NVL(column_name,'NULL'));
    IF ( ( v_schema IS NULL
      AND
      v_table_name IS NULL )
      OR
      (
        column_name IS NULL
      )
      ) THEN
      RETURN NULL;
    END IF;
    SELECT m.diminfo
    INTO   v_dim_array
    FROM   all_sdo_geom_metadata m
    WHERE  m.owner = v_schema
    AND    m.table_name = v_table_name
    AND    m.column_name = column_name;

    IF (v_dim_array IS NOT NULL) THEN
      FOR i IN 1..v_dim_array.count
      LOOP
        IF ( upper(v_dim_array(i).sdo_dimname) = 'M' ) THEN
          RETURN i;
        END IF;
      END LOOP;
    END IF;
    RETURN NULL;
  EXCEPTION
  WHEN no_data_found THEN
    RETURN NULL;
  END find_lrs_dim_pos;
FUNCTION concatenate_geom_segments(geom_segment_1 IN MDSYS.SDO_GEOMETRY,
                                   geom_segment_2 IN MDSYS.SDO_GEOMETRY,
                                   tolerance      IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment_1,nvl(tolerance,0.005)) .st_concat_line(geom_segment_2) .geom;
  END concatenate_geom_segments;
FUNCTION split_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                            split_measure IN NUMBER,
                            tolerance     IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY_array pipelined AS v_geom_array &&INSTALL_SCHEMA..T_GEOMETRIES;
  BEGIN
    IF ( split_measure IS NULL ) THEN
      pipe ROW (geom_segment);
    END IF;
    v_geom_array := &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.05)) .st_split(p_measure=>split_measure);
    IF ( v_geom_array IS NOT NULL) THEN
      IF ( v_geom_array.count >= 1 ) THEN
        pipe ROW (v_geom_array(1).geometry);
        IF ( v_geom_array.count > 1 ) THEN
          pipe ROW (v_geom_array(2).geometry);
        END IF;
      END IF;
    END IF;
    RETURN;
  END split_geom_segment;
PROCEDURE split_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                             split_measure IN NUMBER,
                             segment_1 OUT MDSYS.SDO_GEOMETRY,
                             segment_2 OUT MDSYS.SDO_GEOMETRY,
                             tolerance IN NUMBER DEFAULT 0.005) AS v_geom_array &&INSTALL_SCHEMA..T_GEOMETRIES;
  BEGIN
    IF ( split_measure IS NULL ) THEN
      RETURN ;
    END IF;
    v_geom_array := &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.05)) .st_split(p_measure=>split_measure);
    IF ( v_geom_array IS NOT NULL) THEN
      IF ( v_geom_array.count >= 1 ) THEN
        segment_1 := v_geom_array(1).geometry;
        IF ( v_geom_array.count > 1 ) THEN
          segment_2 := v_geom_array(2).geometry;
        END IF;
      END IF;
    END IF;
    RETURN;
  END split_geom_segment;
FUNCTION clip_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                           start_measure IN NUMBER,
                           end_measure   IN NUMBER,
                           tolerance     IN NUMBER DEFAULT 0.005,
                           unit          IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.005)) .st_lrs_locate_measures( p_start_measure => start_measure,
                                                                                                   p_end_measure => end_measure,
                                                                                                   p_offset => 0,
                                                                                                   p_unit => unit) .geom;
  END clip_geom_segment;
FUNCTION dynamic_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                         start_measure IN NUMBER,
                         end_measure   IN NUMBER,
                         tolerance     IN NUMBER DEFAULT 0.005,
                         unit          IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.005)) .st_lrs_locate_measures( p_start_measure => start_measure,
                                                                                                   p_end_measure => end_measure,
                                                                                                   p_offset => 0,
                                                                                                   p_unit => unit) .geom;
  END dynamic_segment;
FUNCTION locate_pt (geom_segment IN MDSYS.SDO_GEOMETRY,
                    measure      IN NUMBER,
                    offset       IN NUMBER DEFAULT 0,
                    tolerance    IN NUMBER DEFAULT 0.005,
                    unit         IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS v_point MDSYS.SDO_GEOMETRY;
  BEGIN
  v_point := &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.005)) .st_lrs_locate_measure( p_measure => measure,
                                                                                                    p_offset => (0-nvl(offset,0)),
                                                                                                    /* Reverse Sign because Oracle has Left as + while I have left as - */
                                                                                                    p_unit => unit) .st_sdopoint2ord().st_roundordinates(6,6,6,4).geom;
    RETURN v_point;
  END locate_pt;
FUNCTION find_offset (geom_segment IN MDSYS.SDO_GEOMETRY,
                      point        IN MDSYS.SDO_GEOMETRY,
                      tolerance    IN NUMBER DEFAULT 0.005,
                      unit         IN VARCHAR2 DEFAULT NULL)
  RETURN NUMBER AS v_offset NUMBER;
  BEGIN
    /* Reverse Sign because Oracle has Left as + while I have left as - */
    v_offset := &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.005)) .st_lrs_find_offset(p_point=>point,
                                                                                                    p_unit=>unit);
    IF (sign(v_offset) = -1) THEN
      v_offset := abs(v_offset);
    ELSIF (sign(v_offset) = 1) THEN
      v_offset := 0 - v_offset;
    END IF;
    RETURN v_offset;
  END find_offset;
FUNCTION find_measure(lrs_segment IN MDSYS.SDO_GEOMETRY,
                      point       IN MDSYS.SDO_GEOMETRY,
                      tolerance   IN NUMBER DEFAULT 0.005,
                      unit        IN VARCHAR2 DEFAULT NULL)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment,nvl(tolerance,0.005)) .st_lrs_find_measuren(p_geom => point,
                                                                                                p_measuren => 1,
                                                                                                p_unit => unit);
  END find_measure;
FUNCTION set_pt_measure(lrs_segment IN MDSYS.SDO_GEOMETRY,
                        point       IN MDSYS.SDO_GEOMETRY,
                        measure     IN NUMBER,
                        tolerance   IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY AS v_old_vertex mdsys.vertex_type;
  v_new_vertex mdsys.vertex_type;
  BEGIN
    v_old_vertex := &&install_schema..t_vertex(point).st_vertextype();
    v_new_vertex := &&install_schema..t_vertex(point).st_lrs_set_measure(measure).st_vertextype();
    RETURN &&install_schema..t_geometry(lrs_segment,nvl(tolerance,0.005)) .st_updatevertex(p_old_vertex => v_old_vertex,
                                                                                           p_new_vertex => v_new_vertex) .geom;
  END set_pt_measure;
FUNCTION get_measure(point IN MDSYS.SDO_GEOMETRY)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(point).st_lrs_get_measure();
  END get_measure;
FUNCTION project_pt (geom_segment IN MDSYS.SDO_GEOMETRY,
                     point        IN MDSYS.SDO_GEOMETRY,
                     tolerance    IN NUMBER DEFAULT 0.005,
                     unit         IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS v_measure NUMBER;
  BEGIN
  RETURN &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.005)) .st_lrs_project_point (p_point => point,
                                                                                                p_unit => unit).st_sdopoint2ord().geom;
  END project_pt;
FUNCTION lrs_intersection(geom_1    IN MDSYS.SDO_GEOMETRY,
                          geom_2    IN MDSYS.SDO_GEOMETRY,
                          tolerance IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY AS v_tgeom &&install_schema..t_geometry;
  BEGIN
    v_tgeom := &&install_schema..t_geometry(geom_1,tolerance) .st_lrs_intersection(p_geom=>geom_2);
    IF ( v_tgeom IS NOT NULL
      AND
      v_tgeom.st_dimension()=0 ) THEN
      RETURN v_tgeom.st_sdopoint2ord().geom;
    END IF;
    RETURN v_tgeom.geom;
  END lrs_intersection;
FUNCTION convert_to_lrs_geom(standard_geom IN MDSYS.SDO_GEOMETRY,
                             start_measure IN NUMBER DEFAULT NULL,
                             end_measure   IN NUMBER DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(standard_geom) .st_lrs_add_measure(p_start_measure => start_measure,
                                                                           p_end_measure => end_measure,
                                                                           p_unit => NULL).st_sdopoint2ord().st_roundordinates(6,6,6,4).geom;
  END convert_to_lrs_geom;
FUNCTION reverse_measure(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_reverse_measure() .geom;
  END reverse_measure;
FUNCTION reverse_geometry (geom_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment) .st_reverse_linestring() .geom;
  END reverse_geometry;
FUNCTION reset_measure(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_reset_measure() .geom;
  END reset_measure;
PROCEDURE reset_measure(lrs_segment IN OUT MDSYS.SDO_GEOMETRY) AS
  BEGIN
    lrs_segment := &&install_schema..t_geometry(lrs_segment) .st_lrs_reset_measure() .geom;
  END reset_measure;
FUNCTION translate_measure(geom_segment IN MDSYS.SDO_GEOMETRY,
                           translate_m  IN NUMBER)
  RETURN MDSYS.SDO_GEOMETRY AS v_line &&INSTALL_SCHEMA..T_GEOMETRY := &&install_schema..t_geometry(geom_segment);
  BEGIN
    RETURN v_line .st_lrs_scale_measures(p_start_measure=>v_line.st_lrs_start_measure(),
                                         p_end_measure =>v_line.st_lrs_end_measure(),
                                         p_shift_measure=>translate_m) .geom;
  END translate_measure;
FUNCTION redefine_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                               start_measure IN NUMBER,
                               end_measure   IN NUMBER)
  RETURN MDSYS.SDO_GEOMETRY AS v_tgeom &&INSTALL_SCHEMA..T_GEOMETRY;
  BEGIN
    v_tgeom := &&install_schema..t_geometry(geom_segment);
    RETURN
    CASE
    WHEN (
        geom_segment.get_lrs_dim() <> 0
      )
      THEN
      v_tgeom .st_lrs_scale_measures(p_start_measure => start_measure,
                                     p_end_measure => end_measure,
                                     p_shift_measure => 0.0 ).st_roundordinates(6,6,6,4).geom
    ELSE
      v_tgeom .st_lrs_add_measure(p_start_measure=>start_measure,
                                  p_end_measure =>end_measure,
                                  p_unit =>NULL) .st_roundordinates(6,6,6,4).geom
    END;
  END redefine_geom_segment;
PROCEDURE redefine_geom_segment(geom_segment  IN OUT MDSYS.SDO_GEOMETRY,
                                start_measure IN NUMBER,
                                end_measure   IN NUMBER) AS v_tgeom &&INSTALL_SCHEMA..T_GEOMETRY;
  BEGIN
    v_tgeom := &&install_schema..t_geometry(geom_segment);
    geom_segment :=
    CASE
    WHEN (
        geom_segment.get_lrs_dim() <> 0
      )
      THEN
      v_tgeom .st_lrs_scale_measures(p_start_measure => start_measure,
                                     p_end_measure => end_measure,
                                     p_shift_measure => 0.0 ) .st_roundordinates(6,6,6,4).geom
    ELSE
      v_tgeom .st_lrs_add_measure(p_start_measure=>start_measure,
                                  p_end_measure =>end_measure,
                                  p_unit =>NULL) .st_roundordinates(6,6,6,4).geom
    END;
  END redefine_geom_segment;
FUNCTION is_measure_increasing(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN VARCHAR2 AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_is_measure_increasing();
  END is_measure_increasing;
FUNCTION is_measure_decreasing (lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN VARCHAR2 AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_is_measure_decreasing();
  END is_measure_decreasing;
FUNCTION measure_to_percentage(lrs_segment IN MDSYS.SDO_GEOMETRY,
                               measure     IN NUMBER)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_measure_to_percentage(p_measure => measure,
                                                                                   p_unit => NULL);
  END measure_to_percentage;
FUNCTION percentage_to_measure(lrs_segment IN MDSYS.SDO_GEOMETRY,
                               percentage  IN NUMBER)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_percentage_to_measure(p_percentage => percentage,
                                                                                   p_unit => NULL);
  END percentage_to_measure;
  /**
* Description
*  Returns the measure range of a geometric segment, that is, the difference between the start measure and end measure.
**/
FUNCTION measure_range(lrs_segment IN MDSYS.SDO_GEOMETRY,
                       dim_array   IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN NUMBER AS v_tolerance NUMBER := 0.005;
  BEGIN
    IF (dim_array IS NOT NULL
      AND
      dim_array.count > 0 ) THEN
      v_tolerance := dim_array(1).sdo_tolerance;
    END IF;
    RETURN &&install_schema..t_geometry(lrs_segment, v_tolerance) .st_lrs_measure_range(p_unit => NULL);
  END measure_range;
  /**
* The start and end measures of geom_segment must be defined (cannot be null),
* and any measures assigned must be in an ascending or descending order along the segment direction.
**/
FUNCTION is_geom_segment_defined(geom_segment IN MDSYS.SDO_GEOMETRY,
                                 dim_array    IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 AS
  BEGIN
    RETURN
    CASE
    WHEN &&install_schema..t_geometry(geom_segment) .st_lrs_ismeasured() = 1 THEN
      'TRUE'
    ELSE
      'FALSE'
    END;
  END is_geom_segment_defined;
FUNCTION convert_to_std_geom(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_to2d() .geom;
  END convert_to_std_geom;
FUNCTION scale_geom_segment(lrs_segment   IN MDSYS.SDO_GEOMETRY,
                            start_measure IN NUMBER,
                            end_measure   IN NUMBER,
                            shift_measure IN NUMBER,
                            tolerance     IN NUMBER DEFAULT 0.005)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment,nvl(tolerance,0.005)) .st_lrs_scale_measures(p_start_measure => start_measure,
                                                                                                 p_end_measure => end_measure,
                                                                                                 p_shift_measure => shift_measure) .geom;
  END scale_geom_segment;
FUNCTION geom_segment_start_measure(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_start_measure();
  END geom_segment_start_measure;
FUNCTION geom_segment_end_measure(lrs_segment IN MDSYS.SDO_GEOMETRY)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(lrs_segment) .st_lrs_end_measure();
  END geom_segment_end_measure;
FUNCTION geom_segment_start_pt(geom_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry( p_vertex => &&install_schema..t_geometry(geom_segment).st_startvertex(),
                                        p_srid => geom_segment.sdo_srid,
                                        p_tolerance => 0.005) .st_sdopoint2ord() .geom;
  END geom_segment_start_pt;
FUNCTION geom_segment_end_pt(geom_segment IN MDSYS.SDO_GEOMETRY)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(p_vertex => &&install_schema..t_geometry(geom_segment).st_endvertex(),
                                        p_srid => geom_segment.sdo_srid,
                                        p_tolerance => 0.005) .st_sdopoint2ord() .geom;
  END geom_segment_end_pt;
FUNCTION is_shape_pt_measure(geom_segment IN MDSYS.SDO_GEOMETRY,
                             measure      IN NUMBER)
  RETURN VARCHAR2 AS v_lrs_ordinate PLS_INTEGER;
  v_num_coordinates PLS_INTEGER;
  v_ord_dims PLS_INTEGER;
  v_ord PLS_INTEGER;
  v_is_measure_increasing VARCHAR2(10);
  v_is_measure_decreasing VARCHAR2(10);
  BEGIN
    IF ( geom_segment IS NULL
      OR
      measure IS NULL ) THEN
      RETURN 'FALSE';
    END IF;
    v_lrs_ordinate := &&install_schema..itis_lrs.find_lrs_dim_pos(geom_segment);
    IF (v_lrs_ordinate = 0) THEN
      RETURN 'FALSE';
    END IF;
    v_is_measure_increasing := &&install_schema..itis_lrs.is_measure_increasing(geom_segment);
    v_is_measure_decreasing := &&install_schema..itis_lrs.is_measure_decreasing(geom_segment);
    v_ord_dims:= geom_segment.get_dims();
    v_num_coordinates := mdsys.sdo_util.getnumvertices(geom_segment);
    v_ord := v_lrs_ordinate;
    FOR i IN 1..v_num_coordinates
    LOOP
      IF ( geom_segment.sdo_ordinates(v_ord) = measure ) THEN
        RETURN 'TRUE';
      ELSIF ( v_is_measure_increasing='TRUE'
        AND
        measure > geom_segment.sdo_ordinates(v_ord) ) THEN
        RETURN 'FALSE';
      ELSIF ( v_is_measure_decreasing='TRUE'
        AND
        measure < geom_segment.sdo_ordinates(v_ord) ) THEN
        RETURN 'FALSE';
      END IF;
      v_ord := v_ord + v_ord_dims;
    END LOOP;
    RETURN 'FALSE';
  END is_shape_pt_measure;
FUNCTION geom_segment_length(geom_segment IN MDSYS.SDO_GEOMETRY,
                             unit         IN VARCHAR2 DEFAULT NULL)
  RETURN NUMBER AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment) .st_length(p_unit => unit);
  END geom_segment_length;
FUNCTION offset_geom_segment(geom_segment  IN MDSYS.SDO_GEOMETRY,
                             start_measure IN NUMBER,
                             end_measure   IN NUMBER,
                             offset        IN NUMBER DEFAULT 0,
                             tolerance     IN NUMBER DEFAULT 0.005,
                             unit          IN VARCHAR2 DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment,nvl(tolerance,0.005)) .st_lrs_locate_measures( p_start_measure => start_measure,
                                                                                                   p_end_measure => end_measure,
                                                                                                   p_offset => (0-nvl(offset,0)),
                                                                                                   p_unit => unit) .geom;
  END offset_geom_segment;
FUNCTION valid_lrs_pt(point     IN MDSYS.SDO_GEOMETRY,
                      dim_array IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 AS
  BEGIN
    RETURN &&install_schema..t_geometry(point) .st_lrs_valid_point(p_diminfo=>dim_array);
  END valid_lrs_pt;
FUNCTION valid_measure(geom_segment IN MDSYS.SDO_GEOMETRY,
                       measure      IN NUMBER)
  RETURN VARCHAR2 AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment) .st_lrs_valid_measure(p_measure => measure);
  END valid_measure;
FUNCTION valid_geom_segment(geom_segment IN MDSYS.SDO_GEOMETRY,
                            dim_array    IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment) .st_lrs_valid_segment(p_diminfo=>dim_array);
  END valid_geom_segment;
FUNCTION validate_lrs_geometry(geom_segment IN MDSYS.SDO_GEOMETRY,
                               dim_array    IN MDSYS.SDO_DIM_ARRAY DEFAULT NULL)
  RETURN VARCHAR2 AS v_result VARCHAR2(20);
  BEGIN
    v_result := substr(&&install_schema..t_geometry(geom_segment) .st_lrs_valid_geometry(p_diminfo => dim_array),1,20);
    IF ( v_result = 'TRUE' ) THEN
      RETURN v_result;
    ELSIF ( substr(v_result,1,2) = '13' ) THEN
      raise_application_error(0-to_number(v_result),
      CASE v_result
      WHEN '13331' THEN
        'Invalid LRS segment'
      WHEN '13335' THEN
        'Measure information not defined'
      ELSE
        'Unknown error'
      END );
    END IF;
    RETURN v_result;
  END validate_lrs_geometry;
FUNCTION round_coordinates(geom_segment   IN MDSYS.SDO_GEOMETRY,
                           p_x_dec_places IN INTEGER DEFAULT NULL,
                           p_y_dec_places IN INTEGER DEFAULT NULL,
                           p_z_dec_places IN INTEGER DEFAULT NULL,
                           p_w_dec_places IN INTEGER DEFAULT NULL)
  RETURN MDSYS.SDO_GEOMETRY AS
  BEGIN
    RETURN &&install_schema..t_geometry(geom_segment) .st_roundordinates(p_x_dec_places => p_x_dec_places,
                                                                         p_y_dec_places => p_y_dec_places,
                                                                         p_z_dec_places => p_z_dec_places,
                                                                         p_m_dec_places => p_w_dec_places) .geom;
  END round_coordinates;
END itis_lrs;
/
show errors

SET SERVEROUTPUT ON SIZE UNLIMITED
WHENEVER SQLERROR EXIT FAILURE;
DECLARE
   v_OK       BOOLEAN := true;
   v_obj_name VARCHAR2(30) := 'itis_lrs';
BEGIN
   FOR rec IN (select object_name,object_Type, status
                 from user_objects
                where object_name = v_obj_name
               order by object_type) LOOP
      IF ( rec.status = 'VALID' ) Then
         dbms_output.put_line(rec.object_type || ' ' || USER || '.' || rec.object_name || ' is valid.');
      ELSE
         dbms_output.put_line(rec.object_type || ' ' || USER || '.' || rec.object_name || ' is invalid.');
         v_ok := false;
      END IF;
   END LOOP;
   execute immediate 'GRANT EXECUTE ON &&INSTALL_SCHEMA..' || v_obj_name || ' TO public WITH GRANT OPTION';
   IF ( NOT v_OK ) THEN
      RAISE_APPLICATION_ERROR(-20000,v_obj_name || ' failed to install.');
   END IF;
END;
/
SHOW ERRORS
EXIT SUCCESS;
