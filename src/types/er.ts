export interface ErAttribute {
  name: string;
  isKey: boolean;
  isMultivalued: boolean;
  isDerived: boolean;
}

export interface ErParticipant {
  entityName: string;
  cardinality: "1" | "N" | "M";
  participation: "total" | "partial";
}

export interface ErEntity {
  name: string;
  isWeak: boolean;
  attributes: ErAttribute[];
}

export interface ErRelationship {
  name: string;
  isIdentifying: boolean;
  participants: ErParticipant[];
}

export interface ErGraph {
  entities: ErEntity[];
  relationships: ErRelationship[];
}
