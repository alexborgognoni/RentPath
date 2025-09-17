resource "aws_codebuild_project" "build" {
  name          = "${var.project_name}-${var.environment}-build"
  service_role  = aws_iam_role.codebuild_role.arn
  build_timeout = 30

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/standard:7.0" # supports PHP, Node.js
    type            = "LINUX_CONTAINER"
    privileged_mode = true # needed if you use npm/yarn builds
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = file("../buildspec.yml")
  }
}
