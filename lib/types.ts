export type Building = {
  building_id: number;
  building_name: string;
};

export type System = {
  system_id: number;
  system_name: string;
  system_type?: string;
  system_model?: string;
  system_manufacturer?: string;
  building_id?: number;
};

export type Node = {
  node_number: number;
  node_location?: string;
  system_id?: number;
};

export type Loop = {
  loop_number: number;
  loop_info?: string;
  node_number?: number;
  system_id?: number;
};

export type Zone = {
  zone_number: number;
  zone_prefix?: string;
  zone_tag_1?: string;
  zone_tag_2?: string;
  system_id?: number;
  node_number?: number;
  loop_number?: number;
};
