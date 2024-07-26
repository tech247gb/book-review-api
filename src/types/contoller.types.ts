import express from 'express';

export type Request  =  express.Request
export type Response  =  express.Response
export type Next  =  express.NextFunction

export interface SearchQuery {
    createdBy?: string;
    $or?: searchOr[];
  }

  export interface searchOr { 
    author? : RegExp ;
    title? :RegExp
  }