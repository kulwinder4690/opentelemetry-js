/*!
 * Copyright 2019, OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DistributedContext } from '../distributed_context/DistributedContext';
import { SpanContext } from '../trace/span_context';

/**
 * Options needed for metric creation
 */
export interface MetricOptions {
  /** The name of the component that reports the Metric. */
  component?: string;

  /**
   * The description of the Metric.
   * @default ''
   */
  description?: string;

  /**
   * The unit of the Metric values.
   * @default '1'
   */
  unit?: string;

  /** The list of label keys for the Metric. */
  labelKeys?: string[];

  /** The map of constant labels for the Metric. */
  constantLabels?: Map<string, string>;

  /**
   * Indicates the metric is a verbose metric that is disabled by default
   * @default false
   */
  disabled?: boolean;

  /**
   * Asserts that this metric may only increase (e.g. time spent).
   */
  monotonic?: boolean;

  /**
   * (Measure only, default true) Asserts that this metric will only accept
   * non-negative values (e.g. disk usage).
   */
  absolute?: boolean;

  /**
   * Indicates the type of the recorded value.
   * @default {@link ValueType.DOUBLE}
   */
  valueType?: ValueType;
}

/** The Type of value. It describes how the data is reported. */
export enum ValueType {
  INT,
  DOUBLE,
}

/**
 * Metric represents a base class for different types of metric
 * pre aggregations.
 */
export interface Metric<T> {
  /**
   * Returns a Instrument associated with specified LabelSet.
   * It is recommended to keep a reference to the Instrument instead of always
   * calling this method for every operations.
   * @param labels the canonicalized LabelSet used to associate with this metric instrument.
   */
  bind(labels: LabelSet): T;

  /**
   * Returns a Instrument for a metric with all labels not set.
   */
  getDefaultBound(): T;

  /**
   * Removes the Instrument from the metric, if it is present.
   * @param labels the canonicalized LabelSet used to associate with this metric instrument.
   */
  unbind(labels: LabelSet): void;

  /**
   * Clears all timeseries from the Metric.
   */
  clear(): void;

  /**
   * what should the callback signature be?
   */
  setCallback(fn: () => void): void;
}

export interface MetricUtils {
  /**
   * Adds the given value to the current value. Values cannot be negative.
   */
  add(value: number, labelSet: LabelSet): void;

  /**
   * Sets the given value. Values can be negative.
   */
  set(value: number, labelSet: LabelSet): void;

  /**
   * Records the given value to this measure.
   */
  record(value: number, labelSet: LabelSet): void;

  record(
    value: number,
    labelSet: LabelSet,
    distContext: DistributedContext
  ): void;

  record(
    value: number,
    labelSet: LabelSet,
    distContext: DistributedContext,
    spanContext: SpanContext
  ): void;
}

/**
 * key-value pairs passed by the user.
 */
export type Labels = Record<string, string>;

/**
 * Canonicalized labels with an unique string identifier.
 */
export interface LabelSet {
  identifier: string;
  labels: Labels;
}
