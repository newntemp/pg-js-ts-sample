export interface IPage {
  id: number;
  //Crows foot notation is saying this is optional - would want to validate this wasn't a modeling mistake
  document_id?: number;
  /**
   * Note: PS max text size is 1gig. Node strings are ~ the same. Assuming we're not getting close to the limits.
   * https://wiki.postgresql.org/wiki/FAQ#What_is_the_maximum_size_for_a_row.2C_a_table.2C_and_a_database.3F
   */
  body?: string;
  footnote?: string;
}
