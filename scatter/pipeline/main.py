import argparse
import json
import os
import sys
from datetime import datetime

from steps.aggregation import aggregation
from steps.clustering import clustering
from steps.embedding import embedding
from steps.extraction import extraction
from steps.labelling import labelling
from steps.overview import overview
from steps.takeaways import takeaways
from steps.translation import translation
from steps.visualization import visualization
from utils import initialization, run_step, termination


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Run the annotation pipeline with optional flags."
    )
    parser.add_argument(
        "config", help="Path to config JSON file that defines the pipeline execution."
    )
    parser.add_argument(
        "-f",
        "--force",
        action="store_true",
        help="Force re-run all steps regardless of previous execution.",
    )
    parser.add_argument(
        "-o",
        "--only",
        type=str,
        help="Run only the specified step (e.g., extraction, embedding, clustering, etc.).",
    )
    parser.add_argument(
        "--skip-interaction",
        action="store_true",
        help="Skip the interactive confirmation prompt and run pipeline immediately.",
    )
    return parser.parse_args()


def main():
    args = parse_arguments()

    # Convert argparse namespace to sys.argv format for compatibility
    new_argv = [sys.argv[0], args.config]
    if args.force:
        new_argv.append("-f")
    if args.only:
        new_argv.extend(["-o", args.only])
    if args.skip_interaction:
        new_argv.append("--skip-interaction")

    config = initialization(new_argv)

    try:
        run_step("extraction", extraction, config)
        run_step("embedding", embedding, config)
        run_step("clustering", clustering, config)
        run_step("labelling", labelling, config)
        run_step("takeaways", takeaways, config)
        run_step("overview", overview, config)
        run_step("translation", translation, config)
        run_step("aggregation", aggregation, config)
        run_step("visualization", visualization, config)
        termination(config)
    except Exception as e:
        termination(config, error=e)


if __name__ == "__main__":
    main()
