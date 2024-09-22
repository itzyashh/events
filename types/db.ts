import { Database } from "./supabase";


export type Event = Database["public"]["Tables"]["events"]["Row"];

export type Attendee = Database["public"]["Tables"]["attendees"]["Row"];