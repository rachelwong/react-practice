export interface Weather {
  id: string;
  name: string;
  short_name: string;
  icon_uri: string;
}

export interface RaceProfileDataType {
  id: string;
  name: string;
  short_name: string;
}

export interface RaceSummary {
  race_id: string;
  race_name: string;
  race_number: number;
  meeting_id: string;
  meeting_name: string;
  category_id: string;
  advertised_start: {
    seconds: number;
  };
  race_form: {
    distance: number;
    distance_type: RaceProfileDataType;
    distance_type_id: string;
    track_condition: RaceProfileDataType;
    track_condition_id: string;
    weather: Weather;
    weather_id: string;
    race_comment: string;
    additional_data: string;
    generated: number;
    silk_base_url: string;
    race_comment_alternative: string;
  };
  venue_id: string;
  venue_name: string;
  venue_state: string;
  venue_country: string;
}

export interface RaceSummaries extends Record<string, RaceSummary> {} // { next_to_go-id: RaceSummary {} }

export interface NedsRaceResponse {
  next_to_go_ids: string[];
  race_summaries: RaceSummaries;
}
