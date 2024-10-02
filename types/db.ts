import { Database } from "./supabase";


export type Event = Database["public"]["Tables"]["events"]["Row"];

export type Attendee = Database["public"]["Tables"]["attendees"]["Row"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type NewEvent = Database["public"]["Tables"]["events"]["Insert"];

export type NearByEvent = Database["public"]["Functions"]["nearby_events"]["Returns"][0];